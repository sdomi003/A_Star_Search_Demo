# A* Search Visualization
A visualization of A* search. Create your obstacle and watch A* do the work!

This script is LIVE at https://sdomi003.github.io/A_Star_Search_Demo/

Please do give it a try :)

## About A* Search
To start, the goal of A* is to find a path from a starting point to an ending point.
A* combines the approaches of the greedy best-first search and Dijkstra's algorithm.
A* is guaranteed to discover the optimal path IF 
- The heuristic cost calculated is always less than the real cost. That is, never overestimate the cost. This is called admissible.
- The heuristic cost must match the real cost in that a lower heuristic cost must mean a lower real cost when compare with another node that has a higher heuristic cost, despite the cost numbers not needing to be accurate. This is called monotonic.
## What is a heuristic?
When we talk about heuristic cost, we mean the cost assigned to a node that gives us a good idea of how much work it will take to get to the goal node from this node. So for example, a node really far away from the goal node should have a much higher heuristic cost than that of a node right next to the goal node.
The actual formula one uses to calculate heuristic cost can be changed anytime, and will likely yield better results in certain cases.
In this code, I used a hueristic calculation known as the Manhattan Distance.

The Manhattan Distance calculates how far off the current node is from the goal node on the x axis, and adds that to how far off it is on the y axis.

## f = g + h
When we look at which node to explore next, we consider the f cost. The f cost is simply the sum of the heuristic cost (h) and g. Note that g is calculated as the number of nodes away the current node is from the start in the path it took to get to the current node.

'g' is important, because if we only take into account the heuristic cost 'h', we basically have best-first search.
On the flip side, if we only take 'g' into account, we basically end up with Dijkstra's algorithm.

