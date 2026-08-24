import { TopicCategory, Question } from "@/types/quiz";

export const TOPIC_CATEGORIES: TopicCategory[] = [
  // Computer Science Basics
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Arrays, Trees, Graphs, Sorting, Hash Maps, Big-O Complexity & Dynamic Programming",
    category: "cs_basics",
    iconName: "GitBranch",
    defaultDifficulty: "intermediate",
    subtopics: ["Arrays & HashMaps", "Trees & BST", "Graphs & BFS/DFS", "Sorting & Searching", "Dynamic Programming"],
  },
  {
    id: "networks",
    title: "Computer Networks",
    description: "OSI Model, TCP/UDP, HTTP/HTTPS, WebSockets, DNS, CORS & TLS handshake",
    category: "cs_basics",
    iconName: "Network",
    defaultDifficulty: "intermediate",
    subtopics: ["OSI & TCP/IP Layers", "HTTP Protocols & REST", "TCP vs UDP Handshakes", "DNS & Routing", "WebSockets & SSE"],
  },
  {
    id: "oop",
    title: "OOP & System Design Patterns",
    description: "Inheritance, Polymorphism, Encapsulation, SOLID principles, Factory & Singleton",
    category: "cs_basics",
    iconName: "Layers",
    defaultDifficulty: "intermediate",
    subtopics: ["Encapsulation & Polymorphism", "SOLID Principles", "Creational Patterns", "Structural Patterns", "Behavioral Patterns"],
  },
  {
    id: "databases",
    title: "Databases & SQL Theory",
    description: "ACID, Indexing, B-Trees, Normalization, Query Optimization & NoSQL vs SQL",
    category: "cs_basics",
    iconName: "Database",
    defaultDifficulty: "intermediate",
    subtopics: ["ACID & Transactions", "B-Tree & Indexing", "Normalization (1NF-BCNF)", "Query Execution & Locks", "SQL vs NoSQL CAP"],
  },
  {
    id: "os",
    title: "Operating Systems",
    description: "Processes vs Threads, Concurrency, Deadlocks, Virtual Memory & Syscalls",
    category: "cs_basics",
    iconName: "Cpu",
    defaultDifficulty: "advanced",
    subtopics: ["Process & Thread Scheduling", "Deadlocks & Mutexes", "Virtual Memory & Paging", "Context Switching", "File Systems"],
  },
  {
    id: "data-engineering",
    title: "Data Engineering",
    description: "Batch vs Stream processing, ETL pipelines, Distributed computing, Kafka & Spark",
    category: "cs_basics",
    iconName: "Binary",
    defaultDifficulty: "intermediate",
    subtopics: ["ETL vs ELT Pipelines", "Stream Processing (Kafka)", "Distributed Computing (Spark)", "Data Warehousing & Lakehouse", "Data Partitioning"],
  },
  {
    id: "ml-basics",
    title: "Machine Learning Fundamentals",
    description: "Supervised vs Unsupervised, Bias-Variance, Evaluation metrics, Loss functions",
    category: "cs_basics",
    iconName: "Sparkles",
    defaultDifficulty: "beginner",
    subtopics: ["Supervised vs Unsupervised", "Overfitting & Regularization", "Precision, Recall & ROC-AUC", "Gradient Descent", "Loss Functions"],
  },

  // Code Snippets & Output Prediction
  {
    id: "js-output",
    title: "JavaScript / TypeScript Snippets",
    description: "Event Loop, Closures, `this` Binding, Async/Await, Microtasks & Type Coercion",
    category: "code_snippets",
    iconName: "Code2",
    defaultDifficulty: "intermediate",
    subtopics: ["Event Loop & Microtasks", "Closures & Scope", "this & Prototype Chain", "Promises & Async/Await", "Type Coercion"],
  },
  {
    id: "python-output",
    title: "Python Snippets & Quirks",
    description: "Mutability defaults, Scoping (LEGB), Generators, Decorators, Unpacking & GIL",
    category: "code_snippets",
    iconName: "Terminal",
    defaultDifficulty: "intermediate",
    subtopics: ["Default Mutable Arguments", "LEGB Scope & Closures", "Generators & Yield", "Decorators & Wrappers", "List/Dict Comprehensions"],
  },
  {
    id: "react-output",
    title: "React Lifecycle & State Logic",
    description: "Hook lifecycles, Stale closures, Batch re-rendering, State mutation vs immutability",
    category: "code_snippets",
    iconName: "Workflow",
    defaultDifficulty: "intermediate",
    subtopics: ["useEffect Dependency Quirks", "Stale Closures in Hooks", "Batching State Updates", "Memoization & Re-renders", "Ref vs State"],
  },
  {
    id: "sql-output",
    title: "SQL Query Output & Logic",
    description: "Complex Joins, NULL arithmetic, GROUP BY execution order & Window functions",
    category: "code_snippets",
    iconName: "FileCode",
    defaultDifficulty: "intermediate",
    subtopics: ["LEFT vs INNER Joins with NULL", "GROUP BY & HAVING order", "Window Functions (ROW_NUMBER)", "Subqueries & EXISTS", "CASE WHEN Logic"],
  },
];

export const SEED_QUESTIONS: Record<string, Question[]> = {
  "js-output": [
    {
      id: "js-1",
      topicId: "js-output",
      topicTitle: "JavaScript / TypeScript Snippets",
      type: "code_output",
      difficulty: "intermediate",
      question: "What will be printed to the console when the following code runs?",
      codeSnippet: `console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');`,
      language: "javascript",
      options: ["1, 2, 3, 4", "1, 4, 2, 3", "1, 4, 3, 2", "1, 3, 4, 2"],
      correctAnswerIndex: 2,
      explanation: "Synchronous code executes first (1, then 4). Then microtasks in the Promise queue are processed before the next event loop tick (3). Finally, the macrotask setTimeout callback runs (2).",
      keyTakeaway: "Microtasks (Promises, queueMicrotask) execute before Macrotasks (setTimeout, setInterval).",
    },
    {
      id: "js-2",
      topicId: "js-output",
      topicTitle: "JavaScript / TypeScript Snippets",
      type: "code_output",
      difficulty: "intermediate",
      question: "What is the output of the following function invocation?",
      codeSnippet: `const numbers = [1, 2, 3, 4];

const result = numbers.map(num => {
  if (num > 2) return num * 2;
});

console.log(result);`,
      language: "javascript",
      options: ["[6, 8]", "[undefined, undefined, 6, 8]", "[null, null, 6, 8]", "[0, 0, 6, 8]"],
      correctAnswerIndex: 1,
      explanation: "Array.prototype.map always produces an array of the same length as the original. If a callback branch lacks a return statement, JavaScript returns undefined by default.",
      keyTakeaway: "Use Array.prototype.filter before .map, or .flatMap to filter out elements without returning undefined.",
    },
  ],
  "dsa": [
    {
      id: "dsa-1",
      topicId: "dsa",
      topicTitle: "Data Structures & Algorithms",
      type: "mcq",
      difficulty: "intermediate",
      question: "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) containing n nodes?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctAnswerIndex: 2,
      explanation: "In an unbalanced BST (e.g. when elements are inserted in sorted order), the tree degenerates into a singly linked list with depth n. Therefore, search requires traversing all n nodes, giving O(n) worst-case time complexity.",
      keyTakeaway: "Balanced trees (AVL, Red-Black) guarantee O(log n) worst-case search by performing tree rotations.",
    },
  ],
};
