function print_single_composition(comp) {
    if (comp === "")
        return "";
    if (comp === "（＊辰＝⿸＊厂⿱処魚）")
        return "";
    var idc = "⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻";
    var ans = "";
    var comp_ = Array.from(comp);
    for (var i = 0; i < comp_.length; i++) {
        if (idc.includes(comp_[i]) || comp_[i] === "％") {
            ans += comp_[i];
            continue;
        }
        else if (comp_[i] === "＊") {
            ans += comp_[i + 1];
            i++; // extra increment
            continue;
        }
        else {
            ans += getImage(comp_[i], ["SY", "jv", "noborder", "border"], 20, "http://jurliyuuri.com/lin-marn");
        }
    }
    return ans + "<br>";
}
function print_compositions(char) {
    for (var i = 0; i < composition.length; i++) {
        var obj = composition[i];
        if (obj === null) {
            // end of array
            break;
        }
        else if (obj.char === char) {
            return ("<div style='border: 1px solid blue; padding: 5px; margin:5px'>" +
                print_single_composition(obj.decomp1) +
                print_single_composition(obj.decomp2) +
                print_single_composition(obj.decomp3) +
                print_single_composition(obj.decomp4) +
                "</div>");
        }
    }
    return "<div style='border: 1px solid red; padding: 5px; margin:5px'>構成情報なし</div>";
}
