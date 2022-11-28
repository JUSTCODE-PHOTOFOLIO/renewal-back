-- migrate:up
insert into Works_Category (category_name, eng_category_name) values ('패션', 'fashion');
insert into Works_Category (category_name, eng_category_name) values ('패턴', 'pattern');
insert into Works_Category (category_name, eng_category_name) values ('여행', 'travel');
insert into Works_Category (category_name, eng_category_name) values ('동물', 'animal');

insert into Works_Category (category_name, eng_category_name) values ('디자인', 'design');
insert into Works_Category (category_name, eng_category_name) values ('캘리그라피', 'calligraphy');
insert into Works_Category (category_name, eng_category_name) values ('애니메이션', 'annimation');
insert into Works_Category (category_name, eng_category_name) values ('사운드', 'sound');
insert into Works_Category (category_name, eng_category_name) values ('헬로아티스트', 'helloArtist');

insert into public_status (status) values ('public');
insert into public_status (status) values ('private');
insert into public_status (status) values ('reservation');

insert into file_sort (file_sort) values ('Image');
insert into file_sort (file_sort) values ('Sound');
insert into file_sort (file_sort) values ('Video');
insert into file_sort (file_sort) values ('Picture_Book');
insert into file_sort (file_sort) values ('Wallpaper');

insert into Works_Sympathy (sympathy_sort) values ('Like');
insert into Works_Sympathy (sympathy_sort) values ('Touched');
insert into Works_Sympathy (sympathy_sort) values ('Expect');
insert into Works_Sympathy (sympathy_sort) values ('Want to buy');

-- migrate:down

