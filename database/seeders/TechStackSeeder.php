<?php

namespace Database\Seeders;

use App\Models\TechStack;
use Illuminate\Database\Seeder;

class TechStackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $techStacks = [
            // Programming Languages
            'JavaScript',
            'TypeScript',
            'Python',
            'Java',
            'C#',
            'C++',
            'C',
            'Go',
            'Rust',
            'PHP',
            'Ruby',
            'Swift',
            'Kotlin',
            'Dart',
            'Scala',
            'R',
            'MATLAB',
            'Solidity',
            
            // Frontend Frameworks & Libraries
            'React',
            'Vue.js',
            'Angular',
            'Svelte',
            'Next.js',
            'Nuxt.js',
            'Remix',
            'Astro',
            'jQuery',
            'Alpine.js',
            
            // Backend Frameworks
            'Node.js',
            'Express.js',
            'Nest.js',
            'Django',
            'Flask',
            'FastAPI',
            'Spring Boot',
            'Laravel',
            'Ruby on Rails',
            'ASP.NET Core',
            'Gin',
            'Echo',
            
            // Mobile Development
            'React Native',
            'Flutter',
            'Ionic',
            'Xamarin',
            'SwiftUI',
            'Jetpack Compose',
            
            // Databases
            'MySQL',
            'PostgreSQL',
            'MongoDB',
            'Redis',
            'SQLite',
            'MariaDB',
            'Oracle',
            'Microsoft SQL Server',
            'Cassandra',
            'DynamoDB',
            'Elasticsearch',
            'Neo4j',
            'Firebase',
            'Supabase',
            
            // Cloud Platforms
            'AWS',
            'Azure',
            'Google Cloud Platform',
            'DigitalOcean',
            'Heroku',
            'Vercel',
            'Netlify',
            'Railway',
            'Render',
            
            // DevOps & Tools
            'Docker',
            'Kubernetes',
            'Jenkins',
            'GitHub Actions',
            'GitLab CI',
            'CircleCI',
            'Travis CI',
            'Terraform',
            'Ansible',
            'Vagrant',
            'Nginx',
            'Apache',
            
            // Version Control
            'Git',
            'GitHub',
            'GitLab',
            'Bitbucket',
            
            // Testing
            'Jest',
            'Mocha',
            'Cypress',
            'Selenium',
            'Playwright',
            'PyTest',
            'JUnit',
            'PHPUnit',
            
            // State Management
            'Redux',
            'MobX',
            'Zustand',
            'Recoil',
            'Vuex',
            'Pinia',
            
            // CSS Frameworks & Tools
            'Tailwind CSS',
            'Bootstrap',
            'Material-UI',
            'Ant Design',
            'Chakra UI',
            'Sass',
            'Less',
            'Styled Components',
            
            // Build Tools
            'Webpack',
            'Vite',
            'Rollup',
            'Parcel',
            'esbuild',
            'Turbopack',
            
            // CMS & E-commerce
            'WordPress',
            'Shopify',
            'Magento',
            'WooCommerce',
            'Contentful',
            'Strapi',
            'Sanity',
            
            // AI & ML
            'TensorFlow',
            'PyTorch',
            'Keras',
            'Scikit-learn',
            'OpenCV',
            'Hugging Face',
            
            // Message Queues
            'RabbitMQ',
            'Kafka',
            'Redis Pub/Sub',
            
            // GraphQL
            'GraphQL',
            'Apollo',
            'Relay',
            
            // Web3
            'Ethers.js',
            'Web3.js',
            'Hardhat',
            'Truffle',
            
            // Other
            'HTML',
            'CSS',
            'REST API',
            'WebSocket',
            'gRPC',
            'OAuth',
            'JWT',
        ];

        foreach ($techStacks as $techStack) {
            TechStack::firstOrCreate(['name' => $techStack]);
        }
    }
}
