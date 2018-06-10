let id = 0;
export default function Node(data) {
  this.data = data;
  this.left = null
  this.right = null
  this.id = id++;
}

