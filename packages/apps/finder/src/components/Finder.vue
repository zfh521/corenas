<template>
  <div class="finder">
    <div class="finder-toolbar">
      <div class="navigation-buttons">
        <button @click="goBack" :disabled="!canGoBack">
          <span>←</span>
        </button>
        <button @click="goForward" :disabled="!canGoForward">
          <span>→</span>
        </button>
        <button @click="goUp" :disabled="!canGoUp">
          <span>↑</span>
        </button>
      </div>
      <div class="path-bar">
        {{ currentPath }}
      </div>
      <div class="actions">
        <button @click="showNewFolderDialog">New Folder</button>
        <button @click="showNewFileDialog">New File</button>
      </div>
    </div>

    <div class="finder-content">
      <div class="sidebar">
        <div class="favorites">
          <div class="section-title">Favorites</div>
          <div class="favorite-item" @click="navigateTo('/Users')">Users</div>
          <div class="favorite-item" @click="navigateTo('/Applications')">Applications</div>
          <div class="favorite-item" @click="navigateTo('/Documents')">Documents</div>
          <div class="favorite-item" @click="navigateTo('/Downloads')">Downloads</div>
        </div>
      </div>

      <div class="file-list">
        <div
          v-for="item in items"
          :key="item.path"
          class="file-item"
          @click="handleItemClick(item)"
          @contextmenu.prevent="showContextMenu($event, item)"
        >
          <div class="icon">{{ item.type === 'directory' ? '📁' : '📄' }}</div>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <!-- Context Menu -->
    <div v-if="showMenu" class="context-menu" :style="menuPosition">
      <div @click="renameSelected">Rename</div>
      <div @click="deleteSelected">Delete</div>
    </div>

    <!-- Dialogs -->
    <dialog ref="newFolderDialog">
      <form @submit.prevent="createFolder">
        <h3>New Folder</h3>
        <input v-model="newFolderName" placeholder="Folder name" />
        <div class="dialog-buttons">
          <button type="button" @click="closeDialog('newFolderDialog')">Cancel</button>
          <button type="submit">Create</button>
        </div>
      </form>
    </dialog>

    <dialog ref="newFileDialog">
      <form @submit.prevent="createFile">
        <h3>New File</h3>
        <input v-model="newFileName" placeholder="File name" />
        <div class="dialog-buttons">
          <button type="button" @click="closeDialog('newFileDialog')">Cancel</button>
          <button type="submit">Create</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { FileSystemNode } from '@corenas/core';
import FinderApp from '@/FinderApp';

const props = defineProps<{
  app: FinderApp
}>()
const core = props.app.core;

const items = ref<FileSystemNode[]>([]);
const currentPath = ref('/');
const history = ref<string[]>(['/']);
const historyIndex = ref(0);

const newFolderDialog = ref<HTMLDialogElement | null>(null);
const newFileDialog = ref<HTMLDialogElement | null>(null);
const newFolderName = ref('');
const newFileName = ref('');

// Context menu
const showMenu = ref(false);
const menuPosition = ref({ top: '0px', left: '0px' });
const selectedItem = ref<FileSystemNode | null>(null);

const loadCurrentDirectory = async () => {
  try {
    const paths = await core.getCurrentDirectory();
    const itemDetails = await Promise.all(
      paths.map(path => core.getItemDetails(path))
    );
    items.value = itemDetails;
  } catch (error) {
    console.error('Failed to load directory:', error);
  }
};

const navigateTo = async (path: string) => {
  try {
    await core.navigateTo(path);
    currentPath.value = path;
    
    // Update history
    history.value = history.value.slice(0, historyIndex.value + 1);
    history.value.push(path);
    historyIndex.value = history.value.length - 1;
    
    await loadCurrentDirectory();
  } catch (error) {
    console.error('Navigation failed:', error);
  }
};

const handleItemClick = async (item: FileSystemNode) => {
  if (item.type === 'directory') {
    await navigateTo(item.path);
  }
};

const showContextMenu = (event: MouseEvent, item: FileSystemNode) => {
  selectedItem.value = item;
  showMenu.value = true;
  menuPosition.value = {
    top: `${event.clientY}px`,
    left: `${event.clientX}px`
  };
};

// Navigation methods
const goBack = async () => {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    await navigateTo(history.value[historyIndex.value]);
  }
};

const goForward = async () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++;
    await navigateTo(history.value[historyIndex.value]);
  }
};

const goUp = async () => {
  if (core.canGoUp()) {
    await navigateTo(core.getParentPath());
  }
};

// Dialog methods
const showNewFolderDialog = () => {
  newFolderDialog.value?.showModal();
};

const showNewFileDialog = () => {
  newFileDialog.value?.showModal();
};

const closeDialog = (ref: 'newFolderDialog' | 'newFileDialog') => {
  if (ref === 'newFolderDialog') {
    newFolderName.value = '';
    newFolderDialog.value?.close();
  } else {
    newFileName.value = '';
    newFileDialog.value?.close();
  }
};

const createFolder = async () => {
  if (newFolderName.value) {
    try {
      await core.createFolder(newFolderName.value);
      await loadCurrentDirectory();
      closeDialog('newFolderDialog');
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  }
};

const createFile = async () => {
  if (newFileName.value) {
    try {
      await core.createFile(newFileName.value);
      await loadCurrentDirectory();
      closeDialog('newFileDialog');
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  }
};

const renameSelected = async () => {
  if (selectedItem.value) {
    const newName = prompt('Enter new name:', selectedItem.value.name);
    if (newName && newName !== selectedItem.value.name) {
      try {
        await core.rename(selectedItem.value.path, newName);
        await loadCurrentDirectory();
      } catch (error) {
        console.error('Failed to rename:', error);
      }
    }
  }
  showMenu.value = false;
};

const deleteSelected = async () => {
  if (selectedItem.value) {
    if (confirm(`Are you sure you want to delete ${selectedItem.value.name}?`)) {
      try {
        await core.delete(selectedItem.value.path);
        await loadCurrentDirectory();
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  }
  showMenu.value = false;
};

const canGoBack = () => historyIndex.value > 0;
const canGoForward = () => historyIndex.value < history.value.length - 1;
const canGoUp = () => core.canGoUp();

onMounted(() => {
  loadCurrentDirectory();
  
  // Close context menu when clicking outside
  document.addEventListener('click', () => {
    showMenu.value = false;
  });
});
</script>

<style scoped>
.finder {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
}

.finder-toolbar {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  gap: 8px;
}

.navigation-buttons {
  display: flex;
  gap: 4px;
}

.path-bar {
  flex: 1;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.finder-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  padding: 16px;
  border-right: 1px solid #e0e0e0;
}

.section-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.favorite-item {
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
}

.favorite-item:hover {
  background: #f5f5f5;
}

.file-list {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
}

.file-item:hover {
  background: #f5f5f5;
}

.icon {
  font-size: 32px;
}

.name {
  margin-top: 4px;
  text-align: center;
  word-break: break-word;
}

.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 4px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.context-menu div {
  padding: 4px 16px;
  cursor: pointer;
}

.context-menu div:hover {
  background: #f5f5f5;
}

dialog {
  border: none;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

dialog form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

button {
  padding: 4px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

button:hover {
  background: #f5f5f5;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input {
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style> 