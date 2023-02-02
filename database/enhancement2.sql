insert into public.client(
	client_firstname, 
	client_lastname, 
	client_email,
	client_password)
values (
'Tony',
'Stark',
'tony@starkent.com',
'Iam1ronM@n');

update public.client
set client_type = 'Admin'
where client_id = 1;

delete from public.client
where client_id = 1;

update public.inventory
set inv_description = replace(inv_description, 'small interiors', 'a huge interior')
where inv_make = 'GM' and inv_model = 'Hummer';

select inv_make, inv_model, classification_name
from public.inventory
inner join public.classification
on classification.classification_id = inventory.classification_id
where classification_name = 'Sport';

update public.inventory
set inv_image = replace(inv_image, '/images', '/images/vehicles');
update public.inventory
set inv_thumbnail = replace(inv_thumbnail, '/images', '/images/vehicles');