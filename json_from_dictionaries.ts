interface OTM_JSON {
  words: Array<Word>;
}

interface Word {
  entry: Entry;
  translations: Array<Translation<string>>;
  "tags": Array<string>;
  "contents": Array<Content>;
  "variations": Array<Variation>;
  "relations": Array<Relation>;
}

interface Entry {
  id: number;
  form: string;
}

interface Translation<Language extends string> {
  title: Language;
  forms: Array<string>;
}

interface Content {
  title: string;
  text: string;
}

interface Variation {
  title: string;
  form: string;
}

interface Relation {
  title: string,
  entry: {
    id: number;
    form: string;
  }
}

declare var lin: OTM_JSON;
declare var perger: OTM_JSON;
declare var airen: OTM_JSON;
declare var takan_cen: OTM_JSON;

/* the output can single out what's specified by title */
function lookupByTitle<Title extends string>(trs: Word, title: Title): Translation<Title>[] {
  return <Translation<Title>[]>trs.translations.filter(b => b.title === title);
}

function lookupByTitleAndAppendIfEmpty<Title extends string>(a: Word, title: Title, forms_to_append: string[] ){
  var arr = lookupByTitle<Title>(a, title);
  if (arr.length === 0) {
    return [{ title: title, forms: forms_to_append}];
  } else {
    return arr;
  }
}

function json_from_dictionaries(character: string): ({
  air: Word[][],
  lin: Word[],
  pek: Word[],
  tkn: Word[]
} | null) {
  var lin_cuop_dat: Word[] = lin.words.filter(a => a.entry.form.includes(character));
  if (lin_cuop_dat.length === 0) {
    return null;
  }
  /*var perger = lin_cuop_dat.map(function(a){
			return a.translations.filter(b => b.title === "標準パイグ語").map(b => b.forms)
		});*/
  var pek: Word[] = perger.words.filter(function (a: Word): boolean {
    var arr: Translation<"漢字転写">[] = lookupByTitle(a, "漢字転写");
    if (arr.length === 0) {
      return false;
    }
    if (arr.length > 1) {
      alert(`「${character}」処理中にパイグ語辞書でエラー(2)`);
    }
    return arr[0].forms.includes(character);
  });

  function reducer<T>(accumulator: Array<T>, currentValue: Array<T>): Array<T> {
    return accumulator.concat(currentValue);
  }

  
  interface Pair<T> {
    first: T;
    second: T;
  }

  var air_wordlist: Pair<string>[] = lin_cuop_dat
    .map(function (word: Word) {
      var air_translations: Translation<"アイル語">[] = lookupByTitleAndAppendIfEmpty(word, "アイル語", ["~"]);
      var air_translations_forms: string[] = air_translations.map(b => b.forms)[0];

      var air_dict_translations: Translation<"アイル語(辞書表記)">[] = lookupByTitleAndAppendIfEmpty(word, "アイル語(辞書表記)", ["~"]);
      var air_dict_translations_forms: string[] = air_dict_translations.map(b => b.forms)[0];

      return air_translations_forms.map(function (e: string, i: number) {
        return { first: e, second: air_dict_translations_forms[i] };
      });
    })
    .reduce(reducer)
    .filter((a: Pair<string>) => a.first !== "~" || a.second !== "~")
    .filter((a: Pair<string>) => a.first !== "*" || a.second !== "*");

  var air_word_candidate: Word[][] = air_wordlist.map((w: Pair<string>) =>
    airen.words.filter(function (a: Word): boolean {
      /* does not match */

      if (a.entry.form !== w.first) {
        return false;
      } else {
        /* matches, but the old form may not match*/

        var old_form: string[] = a.contents
          .filter((q: Content) => q.title === "旧辞書表記")
          .map((q: Content) => q.text);

        /* old equals the new */
        if (w.first === w.second) {
          /* "旧辞書表記" should not exist in this case */

          return old_form.length === 0;
        } else {
          return w.second === old_form[0];
        }
      }
    })
  );

  var takan: Word[] = takan_cen.words.filter(function (a: Word): boolean {
    var forms: string[][] = lookupByTitle(a, "漢字仮名混じり転写")
      .map((c: Translation<"漢字仮名混じり転写">) => c.forms);
    return forms.filter(str => str.includes(character)).length > 0;
  });

  return {
    air: air_word_candidate,
    lin: lin_cuop_dat,
    pek: pek,
    tkn: takan
  };
}
