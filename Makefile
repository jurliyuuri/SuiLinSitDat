all:
	curl -L http://jurliyuuri.com/lin-marn/image_table/image_existence_table.json -o data/image_existence_table.json
	curl -L http://jurliyuuri.com/lin-marn/image_table/image_existence_table.js -o data/image_existence_table.js
	curl -L http://jurliyuuri.com/lin-marn/image_table/char_and_folder_info.js -o data/char_and_folder_info.js
