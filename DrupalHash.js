var DRUPAL_MIN_HASH_COUNT = 7;
var DRUPAL_MAX_HASH_COUNT = 30;
var DRUPAL_HASH_LENGTH = 55;
var DRUPAL_HASH_COUNT = 15;

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
function getRandomNumber(len){
  var buf = []
          , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          , charlen = chars.length;
 
  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }
 
  return buf.join('');
}
 
 
function strpos (haystack, needle, offset) {
  var i = (haystack+'').indexOf(needle, (offset || 0));
  return i === -1 ? false : i;
}
 

function ord (string) {
  var str = string + '',
    code = str.charCodeAt(0);
  if (0xD800 <= code && code <= 0xDBFF) { 
    var hi = code;
    if (str.length === 1) {
      return code; 
    }
    var low = str.charCodeAt(1);
    return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
  }
  if (0xDC00 <= code && code <= 0xDFFF) { 
    return code;
  }
  return code;
}

 
function _password_itoa64() {
  return './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
}
 

function _password_get_count_log2(setting) {
  itoa64 = _password_itoa64();
  return strpos(itoa64, setting[3]);
}
 

function _password_base64_encode( input, count) {
  var output = '';
  var i = 0;
  var itoa64 = _password_itoa64();
  do {
    value = ord( input[i++]);
    output += itoa64[ value & 0x3f ];
    if (i < count) {
      value |= ord( input[i] ) << 8;
    }
    output += itoa64[(value >> 6) & 0x3f];
    if (i++ >= count) {
      break;
    }
    if (i < count) {
      value |= ord(input[i]) << 16;
    }
    output += itoa64[(value >> 12) & 0x3f];
    if (i++ >= count) {
      break;
    }
    output += itoa64[(value >> 18) & 0x3f];
  } while (i < count);
 
  return output;
}


function _password_crypt(password, setting) {
 setting = setting.substr(0, 12);
 if (setting[0] != '$' || setting[2] != '$') {
 return FALSE;
 }
 
 var count_log2 = _password_get_count_log2(setting);
 
 if (count_log2 < DRUPAL_MIN_HASH_COUNT || count_log2 > DRUPAL_MAX_HASH_COUNT) {
 return false;
 }
 
 var salt = setting.substr(4, 8);
 
 if(salt.length!=8)
 return false;
 
 var count = 1 << count_log2;

 var hash = null;
 var l1password = CryptoJS.enc.Latin1.parse(password);
 var hash = CryptoJS.SHA512(salt + password);
 do {
   hash = CryptoJS.SHA512(hash.concat(l1password));
 } while (--count);
 var hashString = hash.toString(CryptoJS.enc.Latin1);
 
 var len = hashString.length;
 var output =  setting + _password_base64_encode(hashString, len);
 var expected = 12 + Math.ceil((8 * len) / 6);
 return ( output.length == expected ) ? output.substr(0, DRUPAL_HASH_LENGTH) : false;
} 
 
function _password_generate_salt(count_log2) {
  var output = '$S$';
  // We encode the final log2 iteration count in base 64.
  var itoa64 = _password_itoa64();
  output += itoa64[count_log2];
  // 6 bytes is the standard salt for a portable phpass hash.
  output += _password_base64_encode(getRandomNumber(6), 6);
  return output;
}
 
 
 
function _password_validate(password, realPass) {
  var stored_hash;
  stored_hash = realPass;
  
  var type = stored_hash.substr(0, 3);
  var hash = _password_crypt(password, stored_hash);
  return (hash && stored_hash == hash);
};
 

