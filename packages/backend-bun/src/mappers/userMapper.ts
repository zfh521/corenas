import { SqlDefinition } from '../interfaces/sqlMapper';

export const userSqlMap: SqlDefinition = {
  findById: {
    sql: `
      SELECT * FROM users 
      WHERE id = #{id}
    `,
    params: ['id']
  },
  
  findByEmail: {
    sql: `
      SELECT * FROM users 
      WHERE email = #{email}
    `,
    params: ['email']
  },
  
  create: {
    sql: `
      INSERT INTO users (username, email, password, created_at, updated_at)
      VALUES (#{username}, #{email}, #{password}, NOW(), NOW())
      RETURNING *
    `,
    params: ['username', 'email', 'password']
  },
  
  update: {
    sql: `
      UPDATE users 
      SET updated_at = NOW()
      @if(username)
        , username = #{username}
      @endif
      @if(email)
        , email = #{email}
      @endif
      @if(password)
        , password = #{password}
      @endif
      WHERE id = #{id}
      RETURNING *
    `,
    params: ['id', 'username', 'email', 'password']
  },
  
  delete: {
    sql: `
      DELETE FROM users 
      WHERE id = #{id}
    `,
    params: ['id']
  },
  
  findAll: {
    sql: `
      SELECT * FROM users
      ORDER BY created_at DESC
      LIMIT #{limit} OFFSET #{offset}
    `,
    params: ['limit', 'offset']
  },
  
  count: {
    sql: `
      SELECT COUNT(*) as total FROM users
    `
  },
  
  findByCondition: {
    sql: `
      SELECT * FROM users
      WHERE 1=1
      @if(username)
        AND username LIKE #{username}
      @endif
      @if(email)
        AND email = #{email}
      @endif
      @if(role_ids)
        AND role_id IN @foreach(id in role_ids)#{id}@endforeach
      @endif
      ORDER BY created_at DESC
    `,
    params: ['username', 'email', 'role_ids']
  },
  
  batchDelete: {
    sql: `
      DELETE FROM users
      WHERE id IN @foreach(id in ids)#{id}@endforeach
    `,
    params: ['ids']
  },
  
  findByRoles: {
    sql: `
      SELECT u.* 
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      WHERE ur.role_id IN @foreach(id in role_ids)#{id}@endforeach
      GROUP BY u.id
      @if(min_roles)
        HAVING COUNT(DISTINCT ur.role_id) >= #{min_roles}
      @endif
    `,
    params: ['role_ids', 'min_roles']
  }
}; 