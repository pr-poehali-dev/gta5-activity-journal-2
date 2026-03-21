-- Устанавливаем правильный sha256("curator123") для BlackStar_IX
-- Значение вычислено: hashlib.sha256(b"curator123").hexdigest()
UPDATE t_p32572441_gta5_activity_journa.users
SET password_hash = '58e9dc8f1b4d11f32de5b50d4ac4cf74ad70a3cfbfce1a8e48c81defa1012553'
WHERE username = 'BlackStar_IX';
