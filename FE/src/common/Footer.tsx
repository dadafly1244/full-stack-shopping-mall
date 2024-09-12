import React from "react";
import { Typography } from "@material-tailwind/react";

interface FooterProps {
  projectName: string;
  projectDescription: string;
  address: string;
  companyName: string;
}

const Footer: React.FC<FooterProps> = ({
  projectName,
  projectDescription,
  address,
  companyName,
}) => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="w-full p-8 bg-blue-gray-50">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 text-center md:justify-between max-w-screen-xl mx-auto">
        <Typography color="blue-gray" className="font-normal">
          &copy; {year} {companyName}
        </Typography>
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <Typography
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              {projectName}
            </Typography>
          </li>
          <li>
            <Typography
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              {address}
            </Typography>
          </li>
        </ul>
      </div>
      <Typography color="blue-gray" className="font-normal mt-4 text-center">
        {projectDescription}
      </Typography>
    </footer>
  );
};

export default Footer;
