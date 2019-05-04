/* the output can single out what's specified by title */
function lookupByTitle(trs, title) {
    return trs.translations.filter(b => b.title === title);
}
function lookupByTitleAndAppendIfEmpty(a, title, forms_to_append) {
    var arr = lookupByTitle(a, title);
    if (arr.length === 0) {
        return [{ title: title, forms: forms_to_append }];
    }
    else {
        return arr;
    }
}
function json_from_dictionaries(character) {
    var lin_cuop_dat = lin.words.filter(a => a.entry.form.includes(character));
    if (lin_cuop_dat.length === 0) {
        return null;
    }
    /*var perger = lin_cuop_dat.map(function(a){
              return a.translations.filter(b => b.title === "標準パイグ語").map(b => b.forms)
          });*/
    var pek = perger.words.filter(function (a) {
        var arr = lookupByTitle(a, "漢字転写");
        if (arr.length === 0) {
            return false;
        }
        if (arr.length > 1) {
            alert(`「${character}」処理中にパイグ語辞書でエラー(2)`);
        }
        return arr[0].forms.includes(character);
    });
    function reducer(accumulator, currentValue) {
        return accumulator.concat(currentValue);
    }
    var air_wordlist = lin_cuop_dat
        .map(function (word) {
        var air_translations = lookupByTitleAndAppendIfEmpty(word, "アイル語", ["~"]);
        var air_translations_forms = air_translations.map(b => b.forms)[0];
        var air_dict_translations = lookupByTitleAndAppendIfEmpty(word, "アイル語(辞書表記)", ["~"]);
        var air_dict_translations_forms = air_dict_translations.map(b => b.forms)[0];
        return air_translations_forms.map(function (e, i) {
            return { first: e, second: air_dict_translations_forms[i] };
        });
    })
        .reduce(reducer)
        .filter((a) => a.first !== "~" || a.second !== "~")
        .filter((a) => a.first !== "*" || a.second !== "*");
    var air_word_candidate = air_wordlist.map((w) => airen.words.filter(function (a) {
        /* does not match */
        if (a.entry.form !== w.first) {
            return false;
        }
        else {
            /* matches, but the old form may not match*/
            var old_form = a.contents
                .filter((q) => q.title === "旧辞書表記")
                .map((q) => q.text);
            /* old equals the new */
            if (w.first === w.second) {
                /* "旧辞書表記" should not exist in this case */
                return old_form.length === 0;
            }
            else {
                return w.second === old_form[0];
            }
        }
    }));
    var takan = takan_cen.words.filter(function (a) {
        var forms = lookupByTitle(a, "漢字仮名混じり転写")
            .map((c) => c.forms);
        return forms.filter(str => str.includes(character)).length > 0;
    });
    return {
        air: air_word_candidate,
        lin: lin_cuop_dat,
        pek: pek,
        tkn: takan
    };
}
