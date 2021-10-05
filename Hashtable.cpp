static int PRIME_ONE = 5;
static int PRIME_TWO = 7;

typedef struct {
  string key,
  int value;
} Block;

class HashTable {
  private:
    int size;
    int count;
    vector<int> blocks;
    Block &delBlock;

  public:
    HashTable(int s) {
      this->size = s;
      this->count = 0;
      this->blocks = vector<int>(this->size, NULL);
      this->delBlock = NULL;
    }

    int hashCreator(string key, int prime) {
      int hash = 0;
      int len = key.size();
      for(int i = 0; i < len; i++) {
        hash += pow(prime, len-(i+1)) * (key[i] - 'a');
        hash %= this->size
      }
      return hash;
    }

    int gethash(string key, int attempt) {
      int hash_a = this->hashCreator(key, PRIME_ONE);
      int hash_b = this->hashCreator(key, PRIME_TWO);
      return (hash_a + (attempt * (hash_b + 1))) % this->size;
    }

    void insert(string key, int val) {
      Block newBlock = Block({key, val});
      int hash = this->gethash(key, 0);
      Block block = this->blocks[hash];
      int i = 0;
      if (block != NULL && block.key != this->delBlock.key) {
        hash = this->gethash(newBlock.key, i);
        i += 1;
      }
      this->blocks[hash] = newBlock;
      this->count += 1;
      
      int load = this->count * 100 / this->size;
      if(load > 70) this->resizeup(); 
    }

    int search(string key) {
      int hash = this.gethash(key, 0);
      Block block = this->blocks[hash];
      int i = 1;
      while(block != NULL) {
        if(block.key == key) return block->value;
        hash = this->getHash(block.key, i);
        block = this->blocks[hash];
        i++;
      }
      return -1;
    }

    void deleteBlock(string key) {
      int hash = this->gethash(key, 0);
      int block = this->blocks[hash];
      int i = 0;
      while(block != NULL) {
        if(block != this.delBlock) {
          this->blocks[hash] = this.delBlock;
          this.count -= 1;
          break;
        }
        hash = this->gethash(key, i);
        block = this->blocks[hash];
        i += 1;
      }
      int load = this->cout * 100 / this->size;
      if(load < 10) this->resizedown();
    }

    void resizeup() {
      this->size *= 2;
      this->blocks.resize(this->size);
    }

    void resizedown() {
      this->size = this->size / 2;
      this->blocks.resize(this->size);
    }
}
