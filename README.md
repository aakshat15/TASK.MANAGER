"# upEvent" 
register table 
CREATE TABLE `registers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rollNumber` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('faculty','student') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rollNumber` (`rollNumber`),
  UNIQUE KEY `email` (`email`)
) 

event table
 CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `endDate` varchar(255) NOT NULL,
  `createdByfaculty` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`),
  KEY `createdByfaculty` (`createdByfaculty`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`createdByfaculty`) REFERENCES `registers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) 


table revents
 CREATE TABLE `revents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentName` varchar(255) NOT NULL,
  `studentEmail` varchar(255) NOT NULL,
  `eventId` int NOT NULL,
  `rollNumber` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `eventId` (`eventId`),
  KEY `rollNumber` (`rollNumber`),
  CONSTRAINT `revents_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `revents_ibfk_2` FOREIGN KEY (`rollNumber`) REFERENCES `registers` (`rollNumber`) ON DELETE CASCADE ON UPDATE CASCADE
) 


Registers Table:

Contains information about users (both faculty and students).

id is the primary key.

Unique keys for rollNumber and email.

Events Table:

Contains information about events created by faculty.

id is the primary key.

Foreign key createdByfaculty references registers (id).

Revents Table:

Records student registration for events.

id is the primary key.

Foreign keys eventId references events (id) and rollNumber references registers (rollNumber).

Registers table is connected to Events with a one-to-many relationship.

Events table is connected to Revents with a one-to-many relationship.

Registers table is connected to Revents with a one-to-many relationship via rollNumber.