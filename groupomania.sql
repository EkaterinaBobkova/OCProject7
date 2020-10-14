-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Хост: localhost:3307
-- Время создания: Окт 14 2020 г., 16:18
-- Версия сервера: 5.7.24
-- Версия PHP: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `groupomania`
--

-- --------------------------------------------------------

--
-- Структура таблицы `publications`
--

CREATE TABLE `publications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `attachment` longblob,
  `likes` int(11) DEFAULT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` time NOT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `publications`
--

INSERT INTO `publications` (`id`, `title`, `content`, `attachment`, `likes`, `createdAt`, `updatedAt`, `UserId`) VALUES
(573, NULL, 'New post', '', NULL, '2020-10-12', '11:19:58', 1),
(575, NULL, 'Bonjour à tous', '', NULL, '2020-10-12', '11:27:21', 19),
(578, NULL, 'posts', '', NULL, '2020-10-12', '14:01:38', 1),
(579, NULL, 'bonne nouvelle', '', NULL, '2020-10-12', '13:57:14', NULL),
(580, NULL, 'Bonjour', '', NULL, '2020-10-12', '19:41:08', 19);

-- --------------------------------------------------------

--
-- Структура таблицы `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20200902115659-create-user.js'),
('20200902115900-create-publication.js'),
('20200908184111-create-publication.js'),
('20200908193531-create-user.js'),
('20200908193624-create-publication.js');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `bio`, `isAdmin`, `createdAt`, `updatedAt`) VALUES
(1, 'ekaterina.bobkova@yahoo.fr', 'User1', '$2b$10$WiESw0HlhDY4LSCFay9ymOQVnp4J/QTTV1VizfDu/wlpsfBO4YXyO', NULL, NULL, '2020-09-14', '18:41:58'),
(4, 'mail@gmail.ru', 'Serge', '$2b$10$i9KZKbSlo/NoyCZcajXC.OLw7.eePHj/xhUnFCURP6.tPDg.QvEnq', NULL, NULL, '2020-09-21', '18:08:16'),
(15, 'mymail@mail.ru', 'NewUser', '$2b$10$9HY3bIthWvy4iRqJ/2HtceBswIu5XnqiNlOiBYG4S9YXi85d4ka02', NULL, NULL, '2020-10-05', '09:43:30'),
(16, 'user@yahoo.fr', 'User3', '$2b$10$GBvDrmRxKZUlyrncnQo/6O8G2fR79/53QcUyPdZksK6wGbSJDmeYC', NULL, NULL, '2020-10-06', '14:25:57'),
(19, 'email.maxime@yahoo.fr', 'Maxime', '$2b$10$Q5mX5kaj92AQ6R7vRuJHXOvDPkAJogJRqY8ka1ruwBfveTY8a9POO', NULL, NULL, '2020-10-06', '15:43:29'),
(30, 'admin@groupomania.fr', 'Admin', '$2b$10$8hiOS856CjvnnqSsCMtQZucsJBYRT37wsZ1Th3weBj5XDQ9W44o02', NULL, 1, '2020-10-14', '16:03:45');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `publications`
--
ALTER TABLE `publications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Индексы таблицы `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `publications`
--
ALTER TABLE `publications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=605;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `publications`
--
ALTER TABLE `publications`
  ADD CONSTRAINT `publications_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
