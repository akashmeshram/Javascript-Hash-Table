// For double Hashing (Have to be replaced with any larger primes)
const HtPrime1 = 5;
const HtPrime2 = 7;

// Key-value pairs (items) are strored in a object
class HtItem {
	constructor(k, v) {
		this.key = k;
		this.value = v;
	}
}

class Hashtable {
	/** 
	* Hash Tables stores array of items, 
	* details about its size 
	* and how full it is 
	*/
	constructor(size) {
		this.size = size;
		this.count = 0;
		// Array of items are initialise with null which indicates empty buckets
		this.items = new Array(this.size).fill(null);
		this.delItem = new HtItem(null, null);
	}

	/** 
	* We use a genric string hashing function 
	* This hash function has two steps:
	* 1. Convert ASCII string to a number
	* 2. Reduce number to fixed range by taking its remainder mod Hash table size 
	*/
	hash(key, prime) {
		// Prime variable should be larger than size of alphbets (128)
		let hs = 0;
		const len = key.length;
		for(let i = 0; i < len; i++) {
			hs += Math.pow(prime, len - (i+1)) * key.charCodeAt(i);
			hs %= this.size;
		}
		return hs;
	}

	/** 
	* Our hash table will handle collisions using a technique called
	* open addressing with double hashing.
	*/
	getHash(key, attempt) {
		const h_a = this.hash(key, HtPrime1);
		const h_b = this.hash(key, HtPrime2);
		return (h_a + (attempt * (h_b + 1))) % this.size;
	}

	/**
	* To insert a new key-value pair, we iterate through indexes 
	* to find an empty bucket. We then insert the item into that bucket 
	* and increment the hash table's `count` attribute.
	*/
	insert(key, val) {
		const it = new HtItem(key, val);
		let id = this.getHash(it.key, 0);
		let crr = this.items[id];
		let i = 1;
		while(crr != null && crr != this.delItem) {
			id = this.getHash(it.key, i);
			crr = this.items[id];
			i += 1;
		}
		this.items[id] = it;
		this.count += 1;
		// We resize up, if load > 0.7
		const load = this.count * 100 / this.size;
		if(load > 70) this.resizeUp();

		return this;
	}

	/**
	* Searching is similar to inserting, we iterate to check
	* whether the item's key matches the search key.
	*/
	search(key) {
		let id = this.getHash(key, 0);
		let crr = this.items[id];
		let i = 1;
		while(crr != null) {
			if(crr.key == key) return crr.value;
			id = this.getHash(it.key, i);
			crr = this.items[id];
			i += 1;
		}
		return null;
	}

	/**
	* Since item could be part of collision chain
	* To delete an item we replace it with sentinal item
	* `this.delItem` which represent empty bucket
	*/
	delete(key) {
		let id = this.getHash(key, 0);
		let crr = this.items[id];
		let i = 1;
		while(crr != null) {
			if(crr != this.delItem) {
				if(crr.key == key) {
					this.items[key] = this.delItem;
					this.count += 1;
					break;
				}				
			}
			id = this.getHash(it.key, i);
			crr = this.items[id];
			i += 1;
		}
		// We resize down, if load < 0.1
		const load = this.count * 100 / this.size;
		if(load < 10) this.resizeDown();

		return this;
	}

	/**
	* Javascript provides shortcut to resize
	* we just need to change items `array length` attribute
	* On increase size new buckets are filled with null.
	*/

	resizeUp() {
		this.size *= 2;
		this.items.length = this.size;
		return this; 
	}

	resizeDown() {
		this.size = Math.floor(this.size/2);
		this.items.length = this.size;
		return this; 
	}
}

export default Hashtable;
