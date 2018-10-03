CREATE TABLE `user` (
    `email` TEXT,
    `password`  TEXT NOT NULL,
    `activecode`    TEXT NOT NULL UNIQUE,
    `activity`  INTEGER NOT NULL,
    PRIMARY KEY(`email`)
);

CREATE TABLE `file` (
    `id`    TEXT,
    `email` TEXT NOT NULL,
    `name`  TEXT,
    `title` TEXT NOT NULL,
    `submit_time`   TEXT NOT NULL,
    `content`   TEXT,
    `status`    TEXT NOT NULL,
    FOREIGN KEY(`email`) REFERENCES `user`(`email`) ON UPDATE CASCADE ON DELETE NO ACTION,
    PRIMARY KEY(`id`)
);
