CREATE DATABASE trellodb;

CREATE TABLE usertrello(
    user_id SERIAL PRIMARY KEY,
    user_email VARCHAR(128),
    user_password VARCHAR(128),
    user_name_first VARCHAR(64),
    user_name_last VARCHAR(64)
);

CREATE TABLE workspace(
    workspace_id SERIAL PRIMARY KEY,
    workspace_name VARCHAR(128),
    workspace_owner_id INT REFERENCES usertrello(user_id) ON DELETE CASCADE
);

CREATE TABLE board(
    board_id SERIAL PRIMARY KEY,
    board_name VARCHAR(128),
    board_workspace_id INT REFERENCES workspace(workspace_id) ON DELETE CASCADE
);

CREATE TABLE list(
    list_id SERIAL PRIMARY KEY,
    list_title VARCHAR(128),
    list_order INT,
    list_board_id INT REFERENCES board(board_id) ON DELETE CASCADE
);

CREATE TABLE card(
    card_id SERIAL PRIMARY KEY,
    card_description VARCHAR(128),
    card_order INT,
    card_list_id INT REFERENCES list(list_id) ON DELETE CASCADE
);

CREATE TABLE inviteuser(
    invite_id SERIAL PRIMARY KEY,
    invite_by INT REFERENCES usertrello(user_id),
    invite_to INT REFERENCES usertrello(user_id),
    invite_workspace INT REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    invite_accepted BOOLEAN,
    invite_user_role VARCHAR(64)
);

CREATE TABLE workspacemember(
    member_id SERIAL PRIMARY KEY,
    member_user INT REFERENCES usertrello(user_id),
    member_workspace INT REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    member_role VARCHAR(64),
    member_joined_date DATE
);