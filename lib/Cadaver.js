// const table = /%[A-Z_\-]+(\s*=[A-Z_\-]+\s*\[\s*[^\[\]]+\s*\])+/g;
const findTables = /%([A-Z_-]+)(\s*=([A-Z_-]+)\s*\[\s*([^[\]]+)\s*\])+/g;
const findTableOptions = /\s*(=[A-Z_-]+\s*\[\s*[^[\]]+\s*\])\s*/g;
const findTableOptionData = /=([A-Z_-]+)\s*\[\s*([^[\]]+)\s*\]\s*/;
const findReferences = /%([A-Z_-]+)%/g;

class Cadaver {
  /* Initialize cadaver with Cadaver variable passages */

  constructor(p) {
    /**
  	 Stores all variable Cadaver passages.
  	 @property passages
  	 @type Object
  	**/

    this.passages = {};

    p.forEach(passage=>{
      passage.cadaver = this;
      if (passage.tags.includes('cadaver')) {
        this.passages[passage.name] = passage.source;
      }
    })
  }

  /**
   Metafunction for calling all parser sub-functions.
   @method parse
	 @param {String} text Source text to be processed
  **/

  parse(text) {
    let result = text;
    result = this.parseReferences(result);
    result = this.parseTables(result)
    return result;
  }

  /**
   Parses text for Cadaver tables, and evaluates them.
   @method parseTables
	 @param {String} text Source text to be processed
  **/

  parseTables(text) {
    const matchedTables = text.match(findTables);
    if (!matchedTables || !matchedTables.length) return text;

    const processedTables = matchedTables.map(table=>{
      const key = table.match(/%([A-Z_-]+)/)[1];
      /* print(key) */
      const tableOptions = table.match(findTableOptions);
      if (!tableOptions) {
        throw new Error(
`Cadaver could not parse table options for:
${table}`);
      }
      /* print(tableOptions) */
      const opts = {
        key,
        values: {}
      }
      tableOptions.forEach(option=>{
        const [ , value, text] = option.match(findTableOptionData);
        opts.values[value] = text.trim();
      })
      return opts;
    })
    let processedText = text;
    matchedTables.forEach((table,i)=>{
      const pT = processedTables[i]
      const key = pT.key;
      const text = (
           pT.values[window.story.state[key]]
        || pT.values[window.story.state.DEFAULT]
        || "");
      processedText = processedText.replace(table, text)
    })
    return processedText
  }

  /**
   Parses text for Cadaver variable references, and replaces them with parsed text.
   @method parseReferences
	 @param {String} text Source text to be processed
  **/

  parseReferences(text) {
    const matchedRefs = text.match(findReferences);
    if (!matchedRefs || !matchedRefs.length) return text;

    const refs = matchedRefs.map((ref,i,arr)=>{
      const n = ref.slice(1,-1);
      if (!arr.includes(n)) {
        if (this.passages[n]) {
          return n;
        }
      }
    });


    let result = text;
    refs.forEach(ref=>{
      result = result.replace(`%${ref}%`, window.story.render(ref));
    });

    return result;
  }
}

module.exports = Cadaver;
