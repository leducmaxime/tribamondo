-- Migration 0003: Import existing gallery photos
-- Insert existing static images into gallery_photos table

INSERT INTO gallery_photos (url, description, order_index) VALUES
('/images/galerie/image-8.png', NULL, 1),
('/images/galerie/image-14.png', NULL, 2),
('/images/galerie/image-18.png', NULL, 3),
('/images/galerie/image-47.png', NULL, 4),
('/images/galerie/image-49.png', NULL, 5),
('/images/galerie/image-52.png', NULL, 6),
('/images/galerie/image-new-1.png', NULL, 7),
('/images/galerie/image-new-2.png', NULL, 8),
('/images/galerie/image-new-3.png', NULL, 9),
('/images/galerie/image-new-4.png', NULL, 10),
('/images/galerie/image-new-5.png', NULL, 11),
('/images/galerie/image-new-6.png', NULL, 12);
