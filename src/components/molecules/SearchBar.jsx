import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  className,
  showButton = true,
  ...props 
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (!showButton && onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)} {...props}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
        />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-20"
        />
        {showButton && (
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={!query.trim()}
          >
            Search
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;