BEGIN TRANSACTION;
CREATE TABLE usuarios (
	id INTEGER NOT NULL, 
	email VARCHAR(120) NOT NULL, 
	password_hash VARCHAR(255) NOT NULL, 
	nombre VARCHAR(100) NOT NULL, 
	apellido VARCHAR(100) NOT NULL, 
	fecha_registro DATETIME, 
	activo BOOLEAN, rol TEXT DEFAULT 'user', has_access BOOLEAN DEFAULT 0, 
	PRIMARY KEY (id)
);
INSERT INTO usuarios VALUES(1,'test@example.com','pbkdf2:sha256:600000$Mt88OpR3HtgIJeG5$e69f0fe60e3f8432ad373f86d1213b488b305fc5d62ec8d4da240baa27ba3415','Juan','Pérez','2025-07-23 23:05:34.756826',1,'user',1);
INSERT INTO usuarios VALUES(2,'usuario@email.com','pbkdf2:sha256:600000$84WsgYL79Jxr0Pqm$8121abb45892a000128d92c65de66162bb2a0b382575996ab65c373e0c7040d3','Juan','Pérez','2025-07-24 00:03:24.361272',1,'user',1);
INSERT INTO usuarios VALUES(3,'admin@cursohongos.com','pbkdf2:sha256:600000$pQ0p7RDmajUFxiNJ$b8f6dbfc820891fa8d84a719200cec0fb0d6c120aaae5f706a84a1f6a1b4d65e','Administrador','Sistema','2025-08-07 20:15:56.879941',1,'admin',1);
INSERT INTO usuarios VALUES(4,'usuario.prueba@example.com','pbkdf2:sha256:600000$ZP1FvCnD6Wo5Ztnm$8fa42376ee2c6ab8b8cdea089f35ed049c74e64c2936d26bca77677e52f9777b','Usuario','Prueba','2025-08-18 00:36:26.234581',1,'user',0);
INSERT INTO usuarios VALUES(5,'nuevo.usuario@example.com','pbkdf2:sha256:600000$NRNg6OSQyczNHJ9a$b81716c18ba0a8c2aa98a94bf9654d6464c3287554166e4346cbc8e9f477d923','Nuevo','Usuario','2025-08-18 00:37:02.208025',1,'user',0);
INSERT INTO usuarios VALUES(6,'estudiante.sin.acceso@example.com','pbkdf2:sha256:600000$ZRDIN04FGkN0wXTg$c66f33b11782eb6d7dd6a6b1e5971c98e2b8069673493abf9b92c883c8590b46','Estudiante','SinAcceso','2025-08-18 00:59:29.777855',1,'user',0);
INSERT INTO usuarios VALUES(7,'estudiante.prueba@example.com','pbkdf2:sha256:600000$ZnZz4RsQ5ZJts2P0$b1619da8fe70c00c783f495dd0f47a41667e61766206ac61cad04b7b681e3a8c','Estudiante','Prueba','2025-08-18 01:16:00.375637',1,'user',0);
CREATE TABLE hongos (
	id INTEGER NOT NULL, 
	nombre_cientifico VARCHAR(200) NOT NULL, 
	nombre_comun VARCHAR(200), 
	familia VARCHAR(100), 
	descripcion TEXT, 
	habitat TEXT, 
	comestibilidad VARCHAR(50), 
	imagen_url VARCHAR(500), 
	fecha_creacion DATETIME, 
	activo BOOLEAN, 
	PRIMARY KEY (id)
);
INSERT INTO hongos VALUES(1,'Agaricus bisporus','Champiñón común','Agaricaceae','El champiñón común es uno de los hongos más cultivados y consumidos en el mundo.','Suelos ricos en materia orgánica','comestible','https://ejemplo.com/champinon.jpg','2025-07-23 22:37:10.587631',1);
CREATE TABLE lecciones (
	id INTEGER NOT NULL, 
	titulo VARCHAR(200) NOT NULL, 
	descripcion TEXT, 
	contenido TEXT NOT NULL, 
	orden INTEGER NOT NULL, 
	duracion_estimada INTEGER, 
	activo BOOLEAN, 
	fecha_creacion DATETIME, 
	PRIMARY KEY (id)
);
CREATE TABLE leccion_hongos (
	leccion_id INTEGER NOT NULL, 
	hongo_id INTEGER NOT NULL, 
	PRIMARY KEY (leccion_id, hongo_id), 
	FOREIGN KEY(leccion_id) REFERENCES lecciones (id), 
	FOREIGN KEY(hongo_id) REFERENCES hongos (id)
);
CREATE TABLE progreso_usuarios (
	id INTEGER NOT NULL, 
	usuario_id INTEGER NOT NULL, 
	leccion_id INTEGER NOT NULL, 
	completado BOOLEAN, 
	fecha_inicio DATETIME, 
	fecha_completado DATETIME, 
	tiempo_dedicado INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(usuario_id) REFERENCES usuarios (id), 
	FOREIGN KEY(leccion_id) REFERENCES lecciones (id)
);
CREATE TABLE payments (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	amount FLOAT NOT NULL, 
	status VARCHAR(20), 
	method VARCHAR(20) NOT NULL, 
	comprobante_url VARCHAR(500), 
	mp_payment_id VARCHAR(100), 
	created_at DATETIME, 
	updated_at DATETIME, 
	admin_notes TEXT, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES usuarios (id)
);
CREATE UNIQUE INDEX ix_usuarios_email ON usuarios (email);
CREATE INDEX ix_hongos_nombre_cientifico ON hongos (nombre_cientifico);
COMMIT;
