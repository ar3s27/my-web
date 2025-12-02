# MyPortfolio

A modern, responsive personal portfolio and blog website built with Next.js, Tailwind CSS, and TypeScript.

## Features

- **Hero Section**: Engaging introduction with a brief bio.
- **About Me**: Detailed background information.
- **Skills**: Visual representation of technical skills.
- **Projects**: Showcase of featured projects with links to repositories/demos.
- **Blog**: A section for sharing thoughts and articles.
- **Contact**: A functional contact form layout.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
- **Dark Mode**: Seamless support for light and dark themes.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: React 18

## Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm, yarn, or pnpm

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/my-web.git
    cd my-web
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Running Locally

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The output will be in the `.next` folder. You can then start the production server with `npm start`.

## Project Structure

- `src/app`: Contains the main application pages and layouts (App Router).
- `src/components`: Reusable UI components (Navbar, Hero, Footer, etc.).
- `src/lib`: Utility functions and API helpers.
- `src/data`: Static data files.
- `public`: Static assets like images and fonts.

## License

This project is open source and available under the [MIT License](LICENSE).
