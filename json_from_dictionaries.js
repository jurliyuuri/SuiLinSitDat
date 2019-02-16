function json_from_dictionaries(character){
		var lin_cuop_dat = lin.words.filter(a => a.entry.form.includes(character));
		if (lin_cuop_dat.length === 0) {
			return null;
		}
		/*var perger = lin_cuop_dat.map(function(a){
			return a.translations.filter(b => b.title === "標準パイグ語").map(b => b.forms)
		});*/
		var pek = perger.words.filter(function(a){
			var arr = a.translations.filter(b => b.title === "漢字転写");
			/* [{ "title" : "漢字転写", "forms" : [ "噫" ] }] */
			if (arr.length === 0) { return false; }
			if (arr.length > 1) { alert(`「${character}」処理中にパイグ語辞書でエラー(2)`); }
			return arr[0].forms.includes(character);
		});

		const reducer = (accumulator, currentValue) => accumulator.concat(currentValue);

		var air_wordlist = lin_cuop_dat.map(function(a){
			var alpha = a.translations.filter(b => b.title === "アイル語");
			if (alpha.length === 0) {alpha = [{ "title" : "アイル語", "forms" : [ "~" ]}]; }
			alpha = alpha.map(b => b.forms)[0];

			var beta = a.translations.filter(b => b.title === "アイル語(辞書表記)");
			if (beta.length === 0) {beta = [{ "title" : "アイル語(辞書表記)", "forms" : [ "~" ]}]; }
			beta = beta.map(b => b.forms)[0];

			return alpha.map(function(e, i) {
			  return {alpha:e, beta: beta[i]};
			});
		}).reduce(reducer)
		.filter(a => a.alpha !== "~" || a.beta !== "~")
		.filter(a => a.alpha !== "*" || a.beta !== "*");

		var air_word_candidate = air_wordlist.map(w => 
			airen.words.filter(function(a){

				/* does not match */ 
				if (a.entry.form !== w.alpha) {
					return false;
				} else {
					/* matches, but the old form may not match*/

					var old_form = a.contents.filter(q => q.title === "旧辞書表記").map(q => q.text);

					/* old equals the new */
					if (w.alpha === w.beta) {
						/* "旧辞書表記" should not exist in this case */ 
						return old_form.length === 0;
					} else {
						return w.beta === old_form[0];
					}
				}
			})
		);

		var takan = takan_cen.words.filter(function(a){
			var forms = a.translations.filter(b => b.title === "漢字仮名混じり転写").map(c => c.forms);
			return forms.filter(str => str.includes(character)).length > 0;
		});

		return {
			air: air_word_candidate, 
			lin: lin_cuop_dat, 
			pek: pek,
			tkn: takan};
	}
	