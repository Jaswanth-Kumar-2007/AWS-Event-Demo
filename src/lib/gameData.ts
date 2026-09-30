export type MissionId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface MissionDef {
  id: MissionId;
  code: string;
  title: string;
  service: string;
  icon: string;
  points: number;
  description: string;
  story: string;
}

export const MISSIONS: MissionDef[] = [
  {
    id: 1,
    code: 'MISSION 01',
    title: 'Network Foundation',
    service: 'Amazon VPC',
    icon: 'Network',
    points: 10,
    description: 'Build the network foundation for CampusConnect',
    story: 'Before anything else, your cloud resources need a secure network to live in.',
  },
  {
    id: 2,
    code: 'MISSION 02',
    title: 'Compute',
    service: 'Amazon EC2',
    icon: 'Server',
    points: 15,
    description: 'Launch a virtual server for the backend',
    story: 'CampusConnect needs computing power to run its application.',
  },
  {
    id: 3,
    code: 'MISSION 03',
    title: 'Storage',
    service: 'Amazon S3',
    icon: 'HardDrive',
    points: 15,
    description: 'Store images and files in object storage',
    story: 'Students will upload profile and event images. Where should the files go?',
  },
  {
    id: 4,
    code: 'MISSION 04',
    title: 'Database',
    service: 'RDS / DynamoDB / Aurora',
    icon: 'Database',
    points: 15,
    description: 'Choose the right database for each scenario',
    story: 'Different workloads need different databases. Choose wisely.',
  },
  {
    id: 5,
    code: 'MISSION 05',
    title: 'Serverless',
    service: 'AWS Lambda',
    icon: 'Zap',
    points: 15,
    description: 'Process events without managing servers',
    story: 'When a student submits a registration, something needs to process it.',
  },
  {
    id: 6,
    code: 'MISSION 06',
    title: 'User Authentication',
    service: 'Amazon Cognito',
    icon: 'ShieldCheck',
    points: 10,
    description: 'Handle sign-up and login for 5,000 students',
    story: 'CampusConnect needs a way to authenticate users.',
  },
  {
    id: 7,
    code: 'MISSION 07',
    title: 'Final Architecture',
    service: 'Full Architecture',
    icon: 'Cloud',
    points: 20,
    description: 'Assemble the complete architecture under traffic spike',
    story: '50,000 students are trying to access CampusConnect. Build the full system.',
  },
];

export const MAX_SCORE = 100;

export const HINT_COSTS = [0, -2, -5];

export interface ServiceInfo {
  key: string;
  name: string;
  category: string;
  whatItIs: string;
  whatItSolves: string;
  example: string;
  mission: string;
  icon: string;
  color: string;
}

export const SERVICES: ServiceInfo[] = [
  {
    key: 'ec2',
    name: 'Amazon EC2',
    category: 'Compute',
    whatItIs: 'Virtual servers running in AWS data centers.',
    whatItSolves: 'When you need a computer to run your application but do not want to buy physical hardware.',
    example: 'Running a web backend for CampusConnect on a virtual server.',
    mission: 'Mission 02',
    icon: 'Server',
    color: 'orange',
  },
  {
    key: 's3',
    name: 'Amazon S3',
    category: 'Storage',
    whatItIs: 'Object storage for files like images, videos, documents, and backups.',
    whatItSolves: 'Storing large amounts of file data without managing disk space yourself.',
    example: 'Storing student profile photos and event images.',
    mission: 'Mission 03',
    icon: 'HardDrive',
    color: 'blue',
  },
  {
    key: 'rds',
    name: 'Amazon RDS',
    category: 'Database',
    whatItIs: 'Managed relational database service (MySQL, PostgreSQL, and more).',
    whatItSolves: 'When you need a traditional database with tables and relationships without managing the server.',
    example: 'Storing structured student registration records.',
    mission: 'Mission 04',
    icon: 'Database',
    color: 'green',
  },
  {
    key: 'aurora',
    name: 'Amazon Aurora',
    category: 'Database',
    whatItIs: 'High-performance relational database designed for scalability and availability.',
    whatItSolves: 'When a relational workload needs to be fast and reliable at large scale.',
    example: 'A campus-wide application that must stay up during peak traffic.',
    mission: 'Mission 04',
    icon: 'Database',
    color: 'green',
  },
  {
    key: 'dynamodb',
    name: 'Amazon DynamoDB',
    category: 'Database',
    whatItIs: 'Serverless NoSQL database with fast, low-latency access and automatic scaling.',
    whatItSolves: 'When you need simple key-value lookups at high speed without managing infrastructure.',
    example: 'Storing session data or simple user preferences with instant access.',
    mission: 'Mission 04',
    icon: 'Database',
    color: 'green',
  },
  {
    key: 'lambda',
    name: 'AWS Lambda',
    category: 'Serverless',
    whatItIs: 'Run code in response to events without managing any servers.',
    whatItSolves: 'When you need to process events or triggers without running a full server 24/7.',
    example: 'Processing a registration submission automatically when it arrives.',
    mission: 'Mission 05',
    icon: 'Zap',
    color: 'orange',
  },
  {
    key: 'vpc',
    name: 'Amazon VPC',
    category: 'Networking',
    whatItIs: 'A private network environment for your AWS resources.',
    whatItSolves: 'When you need to control how your resources communicate and isolate them from the public internet.',
    example: 'Placing CampusConnect servers in a private network with controlled access.',
    mission: 'Mission 01',
    icon: 'Network',
    color: 'blue',
  },
  {
    key: 'cognito',
    name: 'Amazon Cognito',
    category: 'Authentication',
    whatItIs: 'User authentication service for sign-up, login, and access control.',
    whatItSolves: 'When your app needs user accounts without building authentication from scratch.',
    example: 'Letting 5,000 students sign up and log in to CampusConnect.',
    mission: 'Mission 06',
    icon: 'ShieldCheck',
    color: 'orange',
  },
];

export interface QuizOption {
  label: string;
  value: string;
  correct: boolean;
}

export interface DatabaseScenario {
  id: string;
  scenario: string;
  options: QuizOption[];
  explanation: string;
}

export const DATABASE_SCENARIOS: DatabaseScenario[] = [
  {
    id: 'A',
    scenario:
      'CampusConnect stores structured student registration information with relationships between records.',
    options: [
      { label: 'Amazon RDS', value: 'rds', correct: true },
      { label: 'Amazon DynamoDB', value: 'dynamodb', correct: false },
      { label: 'Amazon S3', value: 's3', correct: false },
    ],
    explanation:
      'RDS is the right choice because it handles structured, relational data with relationships between tables — exactly what student registration records need.',
  },
  {
    id: 'B',
    scenario:
      'A very high-speed application needs simple key-value access with automatic scaling.',
    options: [
      { label: 'Amazon RDS', value: 'rds', correct: false },
      { label: 'Amazon DynamoDB', value: 'dynamodb', correct: true },
      { label: 'Amazon S3', value: 's3', correct: false },
    ],
    explanation:
      'DynamoDB is designed for fast key-value access with automatic scaling. No server management required — it scales for you.',
  },
  {
    id: 'C',
    scenario:
      'A high-performance relational workload requires scalability and availability.',
    options: [
      { label: 'Amazon RDS', value: 'rds', correct: false },
      { label: 'Amazon Aurora', value: 'aurora', correct: true },
      { label: 'Amazon S3', value: 's3', correct: false },
    ],
    explanation:
      'Aurora is built for high performance, scalability, and availability on relational workloads — a step up from standard RDS when you need more power.',
  },
];

export interface FinalEvent {
  id: string;
  label: string;
  prompt: string;
  options: QuizOption[];
}

export const FINAL_EVENTS: FinalEvent[] = [
  {
    id: 'login',
    label: 'USER LOGIN',
    prompt: 'A student tries to log in. Which service handles authentication?',
    options: [
      { label: 'Amazon Cognito', value: 'cognito', correct: true },
      { label: 'Amazon S3', value: 's3', correct: false },
      { label: 'Amazon RDS', value: 'rds', correct: false },
    ],
  },
  {
    id: 'upload',
    label: 'IMAGE UPLOAD',
    prompt: 'User → EC2 → ? — Where should the uploaded image file be stored?',
    options: [
      { label: 'Amazon S3', value: 's3', correct: true },
      { label: 'Amazon RDS', value: 'rds', correct: false },
      { label: 'AWS Lambda', value: 'lambda', correct: false },
    ],
  },
  {
    id: 'registration',
    label: 'REGISTRATION EVENT',
    prompt: 'A student submits an event registration. Which service processes it?',
    options: [
      { label: 'AWS Lambda', value: 'lambda', correct: true },
      { label: 'Amazon S3', value: 's3', correct: false },
      { label: 'Amazon VPC', value: 'vpc', correct: false },
    ],
  },
  {
    id: 'lookup',
    label: 'DATABASE LOOKUP',
    prompt: 'The app needs to look up a student record with relationships. Which database?',
    options: [
      { label: 'Amazon RDS', value: 'rds', correct: true },
      { label: 'Amazon S3', value: 's3', correct: false },
      { label: 'AWS Lambda', value: 'lambda', correct: false },
    ],
  },
  {
    id: 'processing',
    label: 'EVENT-TRIGGERED PROCESSING',
    prompt: 'After a registration is saved, an event triggers background processing. Which service?',
    options: [
      { label: 'AWS Lambda', value: 'lambda', correct: true },
      { label: 'Amazon EC2', value: 'ec2', correct: false },
      { label: 'Amazon Cognito', value: 'cognito', correct: false },
    ],
  },
];

export interface HintSet {
  hints: string[];
}

export const MISSION_HINTS: Record<number, HintSet> = {
  1: {
    hints: [
      'Your resources need a private network environment — think about what provides isolation.',
      'VPC stands for Virtual Private Cloud. It is the foundation for all networking in AWS.',
      'The answer is Amazon VPC — it creates the network where all your other resources will live.',
    ],
  },
  2: {
    hints: [
      'You need a virtual computer to run the backend application.',
      'EC2 stands for Elastic Compute Cloud — it provides virtual servers.',
      'The answer is Amazon EC2 — it gives you a virtual machine in the AWS cloud.',
    ],
  },
  3: {
    hints: [
      'Think about where applications keep actual image and document files.',
      'S3 is object storage designed for files like images, videos, and documents.',
      'The answer is Amazon S3 — it stores the actual file, while the database stores information about the file.',
    ],
  },
  4: {
    hints: [
      'Think about what kind of data each scenario describes — structured, key-value, or high-performance relational.',
      'RDS is for relational data, DynamoDB for fast key-value, and Aurora for high-performance relational.',
      'Match the scenario to the database type: structured relationships → RDS, fast key-value → DynamoDB, high-performance relational → Aurora.',
    ],
  },
  5: {
    hints: [
      'You need something that runs code only when an event occurs — no server to manage.',
      'Lambda runs your code in response to events like a registration submission.',
      'The answer is AWS Lambda — it processes events without you managing any servers.',
    ],
  },
  6: {
    hints: [
      'You need a service designed specifically for user sign-up and login.',
      'Cognito handles authentication, user pools, and sign-in flows.',
      'The answer is Amazon Cognito — it manages user authentication so you do not have to build it yourself.',
    ],
  },
  7: {
    hints: [
      'Think about the path each request takes: users authenticate first, then hit the network, then compute, then storage or database.',
      'Each event has a specific service designed for that task. Match the event to the service purpose.',
      'Login → Cognito, Upload → S3, Registration → Lambda, Lookup → RDS, Processing → Lambda.',
    ],
  },
};
