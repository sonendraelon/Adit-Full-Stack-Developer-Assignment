import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
}

const FilterBar = ({ search, setSearch, statusFilter, setStatusFilter }: FilterBarProps) => {
  return (
    <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative flex-grow w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />
      </div>
      <div className="relative w-full sm:w-48 flex-shrink-0">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
