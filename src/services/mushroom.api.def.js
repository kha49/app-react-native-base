import mushroom from 'mushroomjs-auth-rn';
// const rootApiUrl = 'http://warning-api.test2.siten.vn/api/warning/v1/';
const rootApiUrl = 'http://tfs.siten.vn:41180/api/warning/v1/';

mushroom._defineAsyncResource({
  name: 'user',
  actions: {
    findMany: {clientCache: true},
    findById: {clientCache: true},
    createOne: {},
    updatePartially: {},
    _raw_http_method_check_validate_token: {},
  },
  views: {},
});
mushroom._defineAsyncResource({
  name: 'user_info',
  actions: {
    findMany: {clientCache: true},
    findById: {clientCache: true},
    createOne: {},
    updatePartially: {},
  },
  views: {},
});
mushroom._defineAsyncResource({
  name: 'group',
  actions: {
    findMany: {clientCache: true},
    findById: {clientCache: true},
    createOne: {},
    updatePartially: {},
    deleteOne: {},
  },
  views: {},
});
mushroom._defineAsyncResource({
  name: 'maker',
  actions: {
    findMany: {clientCache: false},
    findById: {clientCache: false},
    createOne: {},
    _raw_http_method_import_maker: {},
  },
  views: {},
});
mushroom._defineAsyncResource({
  name: 'permission',
  actions: {
    findMany: {clientCache: true},
    findById: {clientCache: true},
    createOne: {},
    updatePartially: {},
    deleteOne: {},
  },
  views: {},
});
mushroom._defineAsyncResource({
  name: 'device',
  actions: {
    findMany: {clientCache: true},
    createOne: {},
    _raw_http_method_delete_by_device_token: {},
    _raw_http_method_delete_by_device_id: {},
    _raw_http_method_delete_other_device: {},
    _raw_http_method_save_device: {},
  },
  views: {},
});
mushroom._defineAsyncResource({
  name: 'notification',
  actions: {
    findById: {clientCache: true},
    findMany: {clientCache: true},
    updatePartially: {},
  },
  views: {},
});
mushroom._defineAsyncResource({
  name: 'alarm_images',
  actions: {
    findMany: {clientCache: false},
    createOne: {},
    _raw_http_method_import_maker: {},
  },
  views: {},
});

function toQueryString(obj, path) {
  if (obj === null || obj === undefined || typeof obj == 'function') return '';

  if (
    typeof obj == 'string' ||
    typeof obj == 'number' ||
    typeof obj == 'boolean'
  )
    return obj;

  if (Array.isArray(obj))
    return obj
      .map(function (item) {
        return toQueryString(item, path);
      })
      .join(',');

  var arr = [];
  for (var m in obj) {
    if (!obj.hasOwnProperty(m)) continue;

    var key = (path ? path : '') + m;
    arr.push(key + '=' + toQueryString(obj[m], key));
  }
  return arr.join('&');
}

mushroom.user.getRolesAsync = function (body, param) {
  console.log(
    'mushroom.__createAsyncRestFunction',
    typeof mushroom.__createAsyncRestFunction,
  );
  let fn = mushroom.__createAsyncRestFunction({
    name: 'user.getRoles',
    method: 'POST',
    blankBody: false,
    headers: {
      'X-HTTP-Method-Override': 'getRoles',
    },
    url: mushroom._fnGetRootApiUrl() + 'users/getRoles',
  });
  return fn(body);
};
require('./mushroom.api.custom');
mushroom.$using(rootApiUrl);
export default mushroom;
