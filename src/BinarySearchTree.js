import Node from './Node'

export default function BinarySearchTree(){
  this.root = null

  this.insert = (data) => {
    function insertHelper(data, node){
      if (node === null){
        return new Node(data);
      }
      if(data < node.data){
         node.left = insertHelper(data, node.left);
        return node;
      }

      if(data > node.data){
        node.right = insertHelper(data, node.right);
        return node;
      }
      if(data == node.data){
        return node;
      }
    }
    this.root = insertHelper(data, this.root);
  }
}
