ALTER TABLE member_photos ADD COLUMN image_pos_x REAL DEFAULT 50;
ALTER TABLE member_photos ADD COLUMN image_pos_y REAL DEFAULT 50;
ALTER TABLE member_photos ADD COLUMN image_scale REAL DEFAULT 1;

UPDATE member_photos SET image_pos_x = 50, image_pos_y = 10, image_scale = 1   WHERE key = 'fred';
UPDATE member_photos SET image_pos_x = 50, image_pos_y = 20, image_scale = 1   WHERE key = 'emmanuelle';
UPDATE member_photos SET image_pos_x = 50, image_pos_y = 5,  image_scale = 1.2 WHERE key = 'marcel';
UPDATE member_photos SET image_pos_x = 50, image_pos_y = 36, image_scale = 1   WHERE key = 'groupe';
