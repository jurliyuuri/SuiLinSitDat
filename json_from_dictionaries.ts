interface OTM_JSON {
  words: Array<Word>;
}

interface Word {
  entry: Entry;
  translations: Array<Translation>;
  "tags": Array<string>;
  "contents": Array<Content>;
  "variations": Array<Variation>;
  "relations": Array<Relation>;
}

interface Entry {
  id: number;
  form: string;
}

interface Translation {
  title: string;
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

interface Array<T> {
  includes(searchElement: T, fromIndex?: number): boolean
}

declare var lin: OTM_JSON;
declare var perger: OTM_JSON;
declare var airen: OTM_JSON;
declare var takan_cen: OTM_JSON;

function json_from_dictionaries(character: string) {
  var lin_cuop_dat: Word[] = lin.words.filter(a => a.entry.form.includes(character));
  if (lin_cuop_dat.length === 0) {
    return null;
  }
  /*var perger = lin_cuop_dat.map(function(a){
			return a.translations.filter(b => b.title === "標準パイグ語").map(b => b.forms)
		});*/
  var pek: Word[] = perger.words.filter(function (a: Word): boolean {
    var arr: Translation[] = a.translations.filter((b: Translation) => b.title === "漢字転写");
    /* [{ "title" : "漢字転写", "forms" : [ "噫" ] }] */
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

  interface StringPair {
    alpha: string;
    beta: string;
  }

  var air_wordlist: StringPair[] = lin_cuop_dat
    .map(function (a: Word) {
      var alpha: Translation[] = a.translations.filter(b => b.title === "アイル語");
      if (alpha.length === 0) {
        alpha = [{ title: "アイル語", forms: ["~"] }];
      }
      var alpha2: string[] = alpha.map(b => b.forms)[0];

      var beta: Translation[] = a.translations.filter(b => b.title === "アイル語(辞書表記)");
      if (beta.length === 0) {
        beta = [{ title: "アイル語(辞書表記)", forms: ["~"] }];
      }
      var beta2: string[] = beta.map(b => b.forms)[0];

      return alpha2.map(function (e: string, i: number) {
        return { alpha: e, beta: beta2[i] };
      });
    })
    .reduce(reducer)
    .filter((a: StringPair) => a.alpha !== "~" || a.beta !== "~")
    .filter((a: StringPair) => a.alpha !== "*" || a.beta !== "*");

  var air_word_candidate: Word[][] = air_wordlist.map((w: StringPair) =>
    airen.words.filter(function (a: Word): boolean {
      /* does not match */

      if (a.entry.form !== w.alpha) {
        return false;
      } else {
        /* matches, but the old form may not match*/

        var old_form: string[] = a.contents
          .filter((q: Content) => q.title === "旧辞書表記")
          .map((q: Content) => q.text);

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

  var takan: Word[] = takan_cen.words.filter(function (a: Word): boolean {
    var forms: string[][] = a.translations
      .filter((b: Translation) => b.title === "漢字仮名混じり転写")
      .map((c: Translation) => c.forms);
    return forms.filter(str => str.includes(character)).length > 0;
  });

  return {
    air: air_word_candidate,
    lin: lin_cuop_dat,
    pek: pek,
    tkn: takan
  };
}
