import {
  __esm,
  __name,
  init_esm
} from "./chunk-5A2LE32G.mjs";

// node_modules/deepmerge-ts/dist/index.mjs
function defaultMetaDataUpdater(previousMeta, metaMeta) {
  return metaMeta;
}
function defaultFilterValues(values, meta) {
  return values.filter((value) => value !== void 0);
}
function getObjectType(object) {
  if (typeof object !== "object" || object === null) {
    return 0;
  }
  if (Array.isArray(object)) {
    return 2;
  }
  if (isRecord(object)) {
    return 1;
  }
  if (object instanceof Set) {
    return 3;
  }
  if (object instanceof Map) {
    return 4;
  }
  return 5;
}
function getKeys(objects) {
  const keys = /* @__PURE__ */ new Set();
  for (const object of objects) {
    for (const key of [...Object.keys(object), ...Object.getOwnPropertySymbols(object)]) {
      keys.add(key);
    }
  }
  return keys;
}
function objectHasProperty(object, property) {
  return typeof object === "object" && Object.prototype.propertyIsEnumerable.call(object, property);
}
function getIterableOfIterables(iterables) {
  let mut_iterablesIndex = 0;
  let mut_iterator = iterables[0]?.[Symbol.iterator]();
  return {
    [Symbol.iterator]() {
      return {
        next() {
          do {
            if (mut_iterator === void 0) {
              return { done: true, value: void 0 };
            }
            const result = mut_iterator.next();
            if (result.done === true) {
              mut_iterablesIndex += 1;
              mut_iterator = iterables[mut_iterablesIndex]?.[Symbol.iterator]();
              continue;
            }
            return {
              done: false,
              value: result.value
            };
          } while (true);
        }
      };
    }
  };
}
function isRecord(value) {
  if (!validRecordToStringValues.includes(Object.prototype.toString.call(value))) {
    return false;
  }
  const { constructor } = value;
  if (constructor === void 0) {
    return true;
  }
  const prototype = constructor.prototype;
  if (prototype === null || typeof prototype !== "object" || !validRecordToStringValues.includes(Object.prototype.toString.call(prototype))) {
    return false;
  }
  if (!prototype.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function mergeRecords$1(values, utils, meta) {
  const result = {};
  for (const key of getKeys(values)) {
    const propValues = [];
    for (const value of values) {
      if (objectHasProperty(value, key)) {
        propValues.push(value[key]);
      }
    }
    if (propValues.length === 0) {
      continue;
    }
    const updatedMeta = utils.metaDataUpdater(meta, {
      key,
      parents: values
    });
    const propertyResult = mergeUnknowns(propValues, utils, updatedMeta);
    if (propertyResult === actions.skip) {
      continue;
    }
    if (key === "__proto__") {
      Object.defineProperty(result, key, {
        value: propertyResult,
        configurable: true,
        enumerable: true,
        writable: true
      });
    } else {
      result[key] = propertyResult;
    }
  }
  return result;
}
function mergeArrays$1(values) {
  return values.flat();
}
function mergeSets$1(values) {
  return new Set(getIterableOfIterables(values));
}
function mergeMaps$1(values) {
  return new Map(getIterableOfIterables(values));
}
function mergeOthers$1(values) {
  return values.at(-1);
}
function deepmerge(...objects) {
  return deepmergeCustom({})(...objects);
}
function deepmergeCustom(options, rootMetaData) {
  const utils = getUtils(options, customizedDeepmerge);
  function customizedDeepmerge(...objects) {
    return mergeUnknowns(objects, utils, rootMetaData);
  }
  __name(customizedDeepmerge, "customizedDeepmerge");
  return customizedDeepmerge;
}
function getUtils(options, customizedDeepmerge) {
  return {
    defaultMergeFunctions: mergeFunctions,
    mergeFunctions: {
      ...mergeFunctions,
      ...Object.fromEntries(Object.entries(options).filter(([key, option]) => Object.hasOwn(mergeFunctions, key)).map(([key, option]) => option === false ? [key, mergeFunctions.mergeOthers] : [key, option]))
    },
    metaDataUpdater: options.metaDataUpdater ?? defaultMetaDataUpdater,
    deepmerge: customizedDeepmerge,
    useImplicitDefaultMerging: options.enableImplicitDefaultMerging ?? false,
    filterValues: options.filterValues === false ? void 0 : options.filterValues ?? defaultFilterValues,
    actions
  };
}
function mergeUnknowns(values, utils, meta) {
  const filteredValues = utils.filterValues?.(values, meta) ?? values;
  if (filteredValues.length === 0) {
    return void 0;
  }
  if (filteredValues.length === 1) {
    return mergeOthers(filteredValues, utils, meta);
  }
  const type = getObjectType(filteredValues[0]);
  if (type !== 0 && type !== 5) {
    for (let mut_index = 1; mut_index < filteredValues.length; mut_index++) {
      if (getObjectType(filteredValues[mut_index]) === type) {
        continue;
      }
      return mergeOthers(filteredValues, utils, meta);
    }
  }
  switch (type) {
    case 1: {
      return mergeRecords(filteredValues, utils, meta);
    }
    case 2: {
      return mergeArrays(filteredValues, utils, meta);
    }
    case 3: {
      return mergeSets(filteredValues, utils, meta);
    }
    case 4: {
      return mergeMaps(filteredValues, utils, meta);
    }
    default: {
      return mergeOthers(filteredValues, utils, meta);
    }
  }
}
function mergeRecords(values, utils, meta) {
  const result = utils.mergeFunctions.mergeRecords(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === void 0 && utils.mergeFunctions.mergeRecords !== utils.defaultMergeFunctions.mergeRecords) {
    return utils.defaultMergeFunctions.mergeRecords(values, utils, meta);
  }
  return result;
}
function mergeArrays(values, utils, meta) {
  const result = utils.mergeFunctions.mergeArrays(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === void 0 && utils.mergeFunctions.mergeArrays !== utils.defaultMergeFunctions.mergeArrays) {
    return utils.defaultMergeFunctions.mergeArrays(values);
  }
  return result;
}
function mergeSets(values, utils, meta) {
  const result = utils.mergeFunctions.mergeSets(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === void 0 && utils.mergeFunctions.mergeSets !== utils.defaultMergeFunctions.mergeSets) {
    return utils.defaultMergeFunctions.mergeSets(values);
  }
  return result;
}
function mergeMaps(values, utils, meta) {
  const result = utils.mergeFunctions.mergeMaps(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === void 0 && utils.mergeFunctions.mergeMaps !== utils.defaultMergeFunctions.mergeMaps) {
    return utils.defaultMergeFunctions.mergeMaps(values);
  }
  return result;
}
function mergeOthers(values, utils, meta) {
  const result = utils.mergeFunctions.mergeOthers(values, utils, meta);
  if (result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === void 0 && utils.mergeFunctions.mergeOthers !== utils.defaultMergeFunctions.mergeOthers) {
    return utils.defaultMergeFunctions.mergeOthers(values);
  }
  return result;
}
function mergeRecordsInto$1(mut_target, values, utils, meta) {
  for (const key of getKeys(values)) {
    const propValues = [];
    for (const value of values) {
      if (objectHasProperty(value, key)) {
        propValues.push(value[key]);
      }
    }
    if (propValues.length === 0) {
      continue;
    }
    const updatedMeta = utils.metaDataUpdater(meta, {
      key,
      parents: values
    });
    const propertyTarget = { value: propValues[0] };
    mergeUnknownsInto(propertyTarget, propValues, utils, updatedMeta);
    if (key === "__proto__") {
      Object.defineProperty(mut_target.value, key, {
        value: propertyTarget.value,
        configurable: true,
        enumerable: true,
        writable: true
      });
    } else {
      mut_target.value[key] = propertyTarget.value;
    }
  }
}
function mergeArraysInto$1(mut_target, values) {
  mut_target.value.push(...values.slice(1).flat());
}
function mergeSetsInto$1(mut_target, values) {
  for (const value of getIterableOfIterables(values.slice(1))) {
    mut_target.value.add(value);
  }
}
function mergeMapsInto$1(mut_target, values) {
  for (const [key, value] of getIterableOfIterables(values.slice(1))) {
    mut_target.value.set(key, value);
  }
}
function mergeOthersInto$1(mut_target, values) {
  mut_target.value = values.at(-1);
}
function deepmergeInto(target, ...objects) {
  return void deepmergeIntoCustom({})(target, ...objects);
}
function deepmergeIntoCustom(options, rootMetaData) {
  const utils = getIntoUtils(options, customizedDeepmergeInto);
  function customizedDeepmergeInto(target, ...objects) {
    mergeUnknownsInto({ value: target }, [target, ...objects], utils, rootMetaData);
  }
  __name(customizedDeepmergeInto, "customizedDeepmergeInto");
  return customizedDeepmergeInto;
}
function getIntoUtils(options, customizedDeepmergeInto) {
  return {
    defaultMergeFunctions: mergeIntoFunctions,
    mergeFunctions: {
      ...mergeIntoFunctions,
      ...Object.fromEntries(Object.entries(options).filter(([key, option]) => Object.hasOwn(mergeIntoFunctions, key)).map(([key, option]) => option === false ? [key, mergeIntoFunctions.mergeOthers] : [key, option]))
    },
    metaDataUpdater: options.metaDataUpdater ?? defaultMetaDataUpdater,
    deepmergeInto: customizedDeepmergeInto,
    filterValues: options.filterValues === false ? void 0 : options.filterValues ?? defaultFilterValues,
    actions: actionsInto
  };
}
function mergeUnknownsInto(mut_target, values, utils, meta) {
  const filteredValues = utils.filterValues?.(values, meta) ?? values;
  if (filteredValues.length === 0) {
    return;
  }
  if (filteredValues.length === 1) {
    return void mergeOthersInto(mut_target, filteredValues, utils, meta);
  }
  const type = getObjectType(mut_target.value);
  if (type !== 0 && type !== 5) {
    for (let mut_index = 1; mut_index < filteredValues.length; mut_index++) {
      if (getObjectType(filteredValues[mut_index]) === type) {
        continue;
      }
      return void mergeOthersInto(mut_target, filteredValues, utils, meta);
    }
  }
  switch (type) {
    case 1: {
      return void mergeRecordsInto(mut_target, filteredValues, utils, meta);
    }
    case 2: {
      return void mergeArraysInto(mut_target, filteredValues, utils, meta);
    }
    case 3: {
      return void mergeSetsInto(mut_target, filteredValues, utils, meta);
    }
    case 4: {
      return void mergeMapsInto(mut_target, filteredValues, utils, meta);
    }
    default: {
      return void mergeOthersInto(mut_target, filteredValues, utils, meta);
    }
  }
}
function mergeRecordsInto(mut_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeRecords(mut_target, values, utils, meta);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeRecords(mut_target, values, utils, meta);
  }
}
function mergeArraysInto(mut_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeArrays(mut_target, values, utils, meta);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeArrays(mut_target, values);
  }
}
function mergeSetsInto(mut_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeSets(mut_target, values, utils, meta);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeSets(mut_target, values);
  }
}
function mergeMapsInto(mut_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeMaps(mut_target, values, utils, meta);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeMaps(mut_target, values);
  }
}
function mergeOthersInto(mut_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeOthers(mut_target, values, utils, meta);
  if (action === actionsInto.defaultMerge || mut_target.value === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeOthers(mut_target, values);
  }
}
var actions, actionsInto, ObjectType, validRecordToStringValues, mergeFunctions, mergeIntoFunctions;
var init_dist = __esm({
  "node_modules/deepmerge-ts/dist/index.mjs"() {
    init_esm();
    actions = {
      defaultMerge: Symbol("deepmerge-ts: default merge"),
      skip: Symbol("deepmerge-ts: skip")
    };
    actionsInto = {
      defaultMerge: actions.defaultMerge
    };
    __name(defaultMetaDataUpdater, "defaultMetaDataUpdater");
    __name(defaultFilterValues, "defaultFilterValues");
    (function(ObjectType2) {
      ObjectType2[ObjectType2["NOT"] = 0] = "NOT";
      ObjectType2[ObjectType2["RECORD"] = 1] = "RECORD";
      ObjectType2[ObjectType2["ARRAY"] = 2] = "ARRAY";
      ObjectType2[ObjectType2["SET"] = 3] = "SET";
      ObjectType2[ObjectType2["MAP"] = 4] = "MAP";
      ObjectType2[ObjectType2["OTHER"] = 5] = "OTHER";
    })(ObjectType || (ObjectType = {}));
    __name(getObjectType, "getObjectType");
    __name(getKeys, "getKeys");
    __name(objectHasProperty, "objectHasProperty");
    __name(getIterableOfIterables, "getIterableOfIterables");
    validRecordToStringValues = ["[object Object]", "[object Module]"];
    __name(isRecord, "isRecord");
    __name(mergeRecords$1, "mergeRecords$1");
    __name(mergeArrays$1, "mergeArrays$1");
    __name(mergeSets$1, "mergeSets$1");
    __name(mergeMaps$1, "mergeMaps$1");
    __name(mergeOthers$1, "mergeOthers$1");
    mergeFunctions = {
      mergeRecords: mergeRecords$1,
      mergeArrays: mergeArrays$1,
      mergeSets: mergeSets$1,
      mergeMaps: mergeMaps$1,
      mergeOthers: mergeOthers$1
    };
    __name(deepmerge, "deepmerge");
    __name(deepmergeCustom, "deepmergeCustom");
    __name(getUtils, "getUtils");
    __name(mergeUnknowns, "mergeUnknowns");
    __name(mergeRecords, "mergeRecords");
    __name(mergeArrays, "mergeArrays");
    __name(mergeSets, "mergeSets");
    __name(mergeMaps, "mergeMaps");
    __name(mergeOthers, "mergeOthers");
    __name(mergeRecordsInto$1, "mergeRecordsInto$1");
    __name(mergeArraysInto$1, "mergeArraysInto$1");
    __name(mergeSetsInto$1, "mergeSetsInto$1");
    __name(mergeMapsInto$1, "mergeMapsInto$1");
    __name(mergeOthersInto$1, "mergeOthersInto$1");
    mergeIntoFunctions = {
      mergeRecords: mergeRecordsInto$1,
      mergeArrays: mergeArraysInto$1,
      mergeSets: mergeSetsInto$1,
      mergeMaps: mergeMapsInto$1,
      mergeOthers: mergeOthersInto$1
    };
    __name(deepmergeInto, "deepmergeInto");
    __name(deepmergeIntoCustom, "deepmergeIntoCustom");
    __name(getIntoUtils, "getIntoUtils");
    __name(mergeUnknownsInto, "mergeUnknownsInto");
    __name(mergeRecordsInto, "mergeRecordsInto");
    __name(mergeArraysInto, "mergeArraysInto");
    __name(mergeSetsInto, "mergeSetsInto");
    __name(mergeMapsInto, "mergeMapsInto");
    __name(mergeOthersInto, "mergeOthersInto");
  }
});
init_dist();
export {
  deepmerge,
  deepmergeCustom,
  deepmergeInto,
  deepmergeIntoCustom,
  getKeys,
  getObjectType,
  objectHasProperty
};
//# sourceMappingURL=dist-K5OLYDUH.mjs.map
