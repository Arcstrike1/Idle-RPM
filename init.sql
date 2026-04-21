-- Create application user with proper permissions
CREATE USER IF NOT EXISTS 'idle_rpm_main'@'%' IDENTIFIED BY 'cset155';
GRANT ALL PRIVILEGES ON idlerpm.* TO 'idle_rpm_main'@'%';
FLUSH PRIVILEGES;

-- Use the database
USE idlerpm;

-- Create tables
CREATE TABLE IF NOT EXISTS users(
	id int primary key auto_increment not null,
    username varchar(100) not null,
    email varchar(100) not null,
    password_hash varchar(255) not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	last_login TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS game_saves (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  slot_name VARCHAR(50) NOT NULL DEFAULT 'auto',
  data JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_game_saves_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_slot UNIQUE (user_id, slot_name)
);

CREATE TABLE IF NOT EXISTS friendships (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending','accepted','blocked') NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  CONSTRAINT fk_friend_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_friend_friend FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_friend_request UNIQUE (user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS races (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  creator_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  start_time DATETIME NULL,
  end_time DATETIME NULL,
  CONSTRAINT fk_race_creator FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE set null
);

CREATE TABLE IF NOT EXISTS race_participants (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  race_id BIGINT NOT NULL,
  user_id INT NOT NULL,
  score INT DEFAULT 0,
  finished_at TIMESTAMP NULL,
  position INT NULL,
  CONSTRAINT fk_participant_race FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE CASCADE,
  CONSTRAINT fk_participant_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_race_user (race_id, user_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id varchar(128) COLLATE utf8mb4_bin NOT NULL,
  expires bigint unsigned NOT NULL,
  data mediumtext COLLATE utf8mb4_bin,
  PRIMARY KEY (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
