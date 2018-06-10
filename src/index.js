import './index.css';
import * as d3 from 'd3';
import BinarySearchTree from './BinarySearchTree';
import Node from './Node'

const myBst = new BinarySearchTree();
const r = 15, height = 500, width = 500;

myBst.insert(3);


const children = (d) => {
  let children = [];
  if (d.left){
    children.push(d.left);
    if(!d.right){
      children.push(new Node(Infinity))
    }
  }
  if(d.right){
    if(!d.left){
      children.push(new Node(Infinity))
    }
    children.push(d.right);
  }
  return children;
}

const createTree = bst => {
  const root = d3.hierarchy(bst,children)
  root.dx = width;
  root.dy = 50;
  return d3.tree().nodeSize([35, 50])(root);
};
// Hide none existing nodes
const hideUndefinedNodes = (nodes) => (
  nodes.filter((d,i) => d.data.data === Infinity).attr('opacity', 0)
);
const showDefinedNodes = (nodes) => {
  const n = nodes.filter((d,i) => d.data.data !== Infinity).attr('opacity', 1)
  n.select('text').text(d => d.data.data)

};

const findDuplicates = () => {
  const allNodes = g.select('.nodes').selectAll('g');
  let seen = new Set();
  return allNodes.filter((d,i) => {
    if(d.data.data !== Infinity && seen.has(d.data.data)){
      return true;
    }else{
      seen.add(d.data.data);
      return false;
    }
  })
}
const getKeyNodes = (d) => {
  return d.data.id;
}
const getKeyLinks = (d) => {
  return d.target.data.id;
}

const hideUndefinedLinks = (links) => (
  links.filter((d,i) => {
      if(d.source.data.data === Infinity){
        return true;
      }
      if(d.target.data.data === Infinity){
        return true;
      }
      return false
  })
  .attr('opacity', 0)
);
const showDefinedLinks = (links) => {
  links.filter((d,i) => (d.source.data.data !== Infinity && d.target.data.data !== Infinity)).attr('opacity', 1)
};

let root = createTree(myBst.root);
let x0 = Infinity;
let x1 = -x0;
root.each(d => {
  if (d.x > x1) x1 = d.x;
  if (d.x < x0) x0 = d.x;
});

const svg = d3.select(".chart")
          .attr("width", width)
          .attr("height", height)
        .style("width", "100%")
          .style("height", "auto");

const g = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("transform", `translate(${root.dx},${root.dy})`);

const link = g.append("g")
  .attr('class', 'links')
  .attr("fill", "none")
  .attr("stroke", "#fff")
  .attr("stroke", "#555")
  .attr("stroke-opacity", 0.4)
  .attr("stroke-width", 1.5)
.selectAll("path")
  .data(root.links(), getKeyLinks)
  .enter().append("path")
    .attr("d", d => `
      M${d.target.x},${d.target.y-r}
      L${d.source.x},${d.source.y+r}
    `);

  hideUndefinedLinks(link);

const node = g.append("g")
  .attr('class', 'nodes')
  .selectAll("g")
  .data(root.descendants(), getKeyNodes)
  .enter().append("g")
  .attr("transform", d => `translate(${d.x},${d.y})`);

hideUndefinedNodes(node);

node.append("circle")
    .attr("stroke", d => d.children ? "#555" : "#999")
.attr("fill", "none")
    .attr("r", r)

const text = node.append("text")
    .attr("dy", "0.31em")
    //.attr("x", d => d.children ? -9 : 9)
    .attr("text-anchor", "middle")
    .attr("font-size", 15)
    .attr("stroke", "black")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 1)
    .text(d => d.data.data);


d3.selectAll("#add").on('click', () => {
  myBst.insert(Math.floor(Math.random() * 40));
  //console.log(myBst);
  root = createTree(myBst.root);
  const nodes = g.select('.nodes').selectAll('g').data(root.descendants(), getKeyNodes);
  const links = g.select('.links').selectAll("path").data(root.links(), getKeyLinks);
  console.log(root.links())

  //exit
  nodes.exit().remove();
  links.exit().remove();

  // Links
  showDefinedLinks(links);

  links.transition()
  .attr("d", d => `
      M${d.target.x},${d.target.y-r}
      L${d.source.x},${d.source.y+r}
    `);

  //Entering links
 const newLinks = links.enter()
    .append("path")
    .attr("d", d => `
    M${d.target.x},${d.target.y-r}
    L${d.source.x},${d.source.y+r}
  `)
  .attr('opacity', 0)
  .transition()
  .attr('opacity', 1);

  hideUndefinedLinks(newLinks);

  // NODES
  showDefinedNodes(nodes);
 nodes.transition().attr("transform", d => `translate(${d.x},${d.y})`);

  //entering nodes
 const newNodes = nodes.enter()
    .append("g")
    .attr("transform", d => `translate(${d.x},${d.y})`)


  newNodes.append("circle")
    .attr("stroke", d => d.children ? "#555" : "#999")
    .attr("fill", "none")
    .attr("r", r)
    .attr('opacity', 0)
    .transition()
    .attr('opacity', 1);

  hideUndefinedNodes(newNodes);

  const text = newNodes.append('text')
   .attr("dy", "0.31em")
    //.attr("x", d => d.children ? -9 : 9)
    .attr("text-anchor", "middle")
    .attr("font-size", 15)
    .attr("stroke", "black")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 1)
    .text(d => d.data.data);

  //console.log(findDuplicates());

  //exits




})


//Todo Fix issue with insertion. or how it is visualized.

