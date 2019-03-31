.PHONY: all
.PHONY: curl
.PHONY: ts

all:
	make curl
	make ts

ts:
	tsc *.ts --strictNullChecks || true
	prettier --write *.js

curl:
	#curl -L http://jurliyuuri.com/lin-marn/image_table/image_existence_table.json -o data/image_existence_table.json
	#curl -L http://jurliyuuri.com/lin-marn/image_table/image_existence_table.js -o data/image_existence_table.js
	#curl -L http://jurliyuuri.com/lin-marn/image_table/char_and_folder_info.js -o data/char_and_folder_info.js
	curl -L http://jurliyuuri.com/praige-zerp/prai%20ge%20zerp.json -o curl/prai_ge_zerp.json
	echo var perger= > data/perger.js
	cat curl/prai_ge_zerp.json >> data/perger.js

	curl -L http://jurliyuuri.com/bhaataan/bhat.json -o curl/bhat.json
	echo var phertars= > data/phertars.js
	cat curl/bhat.json >> data/phertars.js

	curl -L http://jurliyuuri.com/lin-marn/air_compressed.json -o curl/air_compressed.json
	echo var airen= > data/airen.js
	cat curl/air_compressed.json >> data/airen.js

	curl -L http://jurliyuuri.com/lin-marn/lin%20cuop2%20dat2.json -o curl/lin_cuop_dat.json
	echo var lin= > data/lin.js
	cat curl/lin_cuop_dat.json >> data/lin.js

	curl -L http://jurliyuuri.com/takan_cen/%E7%9A%87%E8%A8%80%E9%9B%86%E6%9B%B8.json -o curl/皇言集書.json
	echo var takan_cen= > data/takan_cen.js
	cat curl/皇言集書.json >> data/takan_cen.js

	curl -L http://jurliyuuri.com/lin-marn/composition.txt -o curl/composition.txt
	echo var composition= > data/composition.js
	echo char\\tdecomp1\\tdecomp2\\tdecomp3\\tdecomp4 > data/tmp.txt
	tail -n +4 curl/composition.txt >> data/tmp.txt
	cat data/tmp.txt | ./tsv2json.sh >> data/composition.js # removes the explanations of ＊ and ％

	curl -L https://sites.google.com/site/linzizihai/akaibu -o curl/akaibu.html
