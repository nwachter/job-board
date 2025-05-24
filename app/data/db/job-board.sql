-- ========================
-- 🌍 Locations
-- ========================
INSERT INTO Location (id, city, country, createdAt, updatedAt) VALUES
(1, 'Paris', 'France', NOW(), NOW()),
(2, 'Lyon', 'France', NOW(), NOW()),
(3, 'Marseille', 'France', NOW(), NOW());

-- ========================
-- 🧑‍💼 Users
-- ========================
INSERT INTO User (id, username, email, password, role, avatar, createdAt, updatedAt) VALUES
(5, 'sophie.recruiter', 'sophie@techhub.io', 'hashedpassword1', 'RECRUITER', 'https://i.pravatar.cc/150?img=47', NOW(), NOW()),
(2, 'michael.dev', 'michael.dev@mail.com', 'hashedpassword2', 'USER', 'https://i.pravatar.cc/150?img=32', NOW(), NOW()),
(3, 'lucas.hr', 'lucas.hr@creativecorp.fr', 'hashedpassword3', 'RECRUITER', 'https://i.pravatar.cc/150?img=12', NOW(), NOW()),
(4, 'julie.frontend', 'julie.frontend@mail.com', 'hashedpassword4', 'USER', 'https://i.pravatar.cc/150?img=54', NOW(), NOW());

-- ========================
-- 🛠 Skills
-- ========================
INSERT INTO Skill (id, name, createdAt, updatedAt) VALUES
(1, 'React', NOW(), NOW()),
(2, 'Node.js', NOW(), NOW()),
(3, 'TypeScript', NOW(), NOW()),
(4, 'GraphQL', NOW(), NOW()),
(5, 'Docker', NOW(), NOW());

-- ========================
-- 💼 Offers
-- ========================
INSERT INTO Offer (id, title, description, company_name, salary, location_id, contract_type, recruiter_id, createdAt, updatedAt) VALUES
(1, 'Frontend Developer (React)', 'We''re looking for a skilled React developer to join our dynamic product team.', 'TechHub', 45000, 1, 'CDI', 1, NOW(), NOW()),
(2, 'Backend Developer (Node.js)', 'You will help us scale our APIs and optimize performance.', 'CreativeCorp', 50000, 2, 'CDD', 3, NOW(), NOW()),
(3, 'Fullstack Developer (React + Node)', 'Join us to work on an exciting SaaS platform with cutting-edge technologies.', 'TechHub', 55000, 1, 'Freelance', 1, NOW(), NOW());

-- ========================
-- 🤝 Applications
-- ========================
INSERT INTO Application (id, content, firstname, lastname, email, offer_id, user_id, cv, status, createdAt, updatedAt, feedback) VALUES
(1, 'I''m a passionate frontend developer with 3 years of React experience. Looking forward to contributing!', 'Michael', 'Dupont', 'michael.dev@mail.com', 1, 2, 'cv_michael_dupont.pdf', 'PENDING', NOW(), NOW(), NULL),
(2, 'Experienced in fullstack development, I am excited by this opportunity. Let''s build great things together!', 'Julie', 'Martin', 'julie.frontend@mail.com', 3, 4, 'julie_martin_cv.pdf', 'ACCEPTED', NOW(), NOW(), 'Great technical profile, we''ll move forward with an interview.');

-- ========================
-- 🔗 UserSkills (User - Skill relation)
-- ========================
INSERT INTO _UserSkills (A, B) VALUES
(2, 1), -- Michael: React
(2, 3), -- Michael: TypeScript
(4, 1), -- Julie: React
(4, 2), -- Julie: Node.js
(4, 4); -- Julie: GraphQL

-- ========================
-- 🔗 OfferSkills (Offer - Skill relation)
-- ========================
INSERT INTO _OfferSkills (A, B) VALUES
(1, 1), -- Offer 1: React
(1, 3), -- Offer 1: TypeScript
(2, 2), -- Offer 2: Node.js
(2, 5), -- Offer 2: Docker
(3, 1), -- Offer 3: React
(3, 2), -- Offer 3: Node.js
(3, 3); -- Offer 3: TypeScript
