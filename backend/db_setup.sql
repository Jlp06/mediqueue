-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- AUTH USERS TABLE
CREATE TABLE IF NOT EXISTS auth_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) DEFAULT 'user'
);

-- DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    counters INTEGER DEFAULT 0,
    doctors INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COUNTERS TABLE
CREATE TABLE IF NOT EXISTS counters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    department_id INTEGER NOT NULL,
    active BOOLEAN DEFAULT true,
    CONSTRAINT counters_department_id_fkey 
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- QUEUE TABLE
CREATE TABLE IF NOT EXISTS queue (
    token_number SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
);

-- QUEUES TABLE
CREATE TABLE IF NOT EXISTS queues (
    id SERIAL PRIMARY KEY,
    auth_user_id INTEGER NOT NULL,
    token_number INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT queues_auth_user_id_fkey 
        FOREIGN KEY (auth_user_id) REFERENCES auth_users(id)
);

-- TOKENS TABLE
CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY,
    token_number INTEGER NOT NULL,
    department_id INTEGER NOT NULL,
    counter_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT tokens_counter_id_fkey 
        FOREIGN KEY (counter_id) REFERENCES counters(id),

    CONSTRAINT tokens_department_id_fkey 
        FOREIGN KEY (department_id) REFERENCES departments(id)
);
