browser.menus.create({
  id: "remove-duplicate-bms-in-folder",
  title: "BmBGone - remove duplicates",
  contexts: ["bookmark"] 
});

function findDuplicateURLs(bms){
  let uniques = new Set();
  let duplicateIDs = [];
  for(let bm of bms){
    if(uniques.has(bm.url)){
      duplicateIDs.push(bm.id)
    }else{
      uniques.add(bm.url)
    }
  }
  return duplicateIDs
}

function findDuplicateTitles(bms){
  let uniques = new Set();
  let duplicateIDs = [];
  for(let bm of bms){
    if(uniques.has(bm.title)){
      duplicateIDs.push(bm.id)
    }else{
      uniques.add(bm.title)
    }
  }
  return duplicateIDs
}

function findDuplicateTitleAndURLs(bms){
  let uniques = new Set();
  let duplicateIDs = [];
  for(let bm of bms){
    let hash = bm.title+bm.url;
    if(uniques.has(hash)){
      duplicateIDs.push(bm.id)
    }else{
      uniques.add(hash)
    }
  }
  return duplicateIDs
}

function findDuplicates(bms,options){
  switch(options.matchMode){
    case "url-only":
      return findDuplicateURLs(bms)
    case "title-only":
      return findDuplicateTitles(bms)
    case "url-and-title":
      return findDuplicateTitleAndURLs(bms)
    default:
      console.warn(`unsupported matchMode option: "${options.matchMode}"`);
      return []
  }
}

browser.menus.onClicked.addListener((info, bm) => {
  if (info.menuItemId === "remove-duplicate-bms-in-folder") {
    Promise.all([
      browser.storage.local.get(["matchMode"]),
      browser.bookmarks.getChildren(info.bookmarkId)
    ])
    .then((promises) => {
      let [options,children] = promises;
      if(children.length){
        if(!options.matchMode){
          options.matchMode = "url-only"
        }
        let duplicateIDs = findDuplicates(
          children.filter(a => a.type === "bookmark"),
          options);
        
        Promise.all(duplicateIDs.map(a => browser.bookmarks.remove(a)))
        .then(() => console.log(`Removed ${duplicateIDs.length} bookmarks`))
        .catch(e => console.error(e))
      }
    })
    .catch(console.error)
  }
});