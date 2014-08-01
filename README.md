DrupalHash
==========

This code allows users to generate SHA512 and MD5 hashes for direct
substitution into a Drupal 5, 6 or 7 database. It operates as a webpage with
all of the calcuations done client side in javascript. 

Installation/Usage
------------------
None to speak of. Just point a browser at the index.html file and make sure you
have javascript enabled. In principal you could put the DruaplHash directory in
a web accessible location and access it that way - the hashes are all
calculated locally so there is no obvious security leak that I can think of.
The only dependency to speak of is CryptoJS, which is served up from googlecode
so shouldn't be an issue.

History
-------
There is very little original code in here, most of the original code comes
from Giannhs Apostolidhs <giannhs.apostolidhs@gmail.com> in this blog post:
http://giannis.e-apostolidis.gr/blog/drupal-7-password-encryption-javascript/.

I have taken that code and smacked it around a bit to do what I want. The main
change is the removal of node.js in place of CryptoJS. His code is nice enough
but at the moment my additions/changes are an awful mess. Use at your own risk.

-Ian Allison <IFAllison@gmail.com>
