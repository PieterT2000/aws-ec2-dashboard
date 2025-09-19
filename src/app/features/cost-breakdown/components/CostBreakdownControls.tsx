"use client";

import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEC2TagKeys } from "../hooks/useCostBreakdownQueries";
import {
  GroupByDimensionWithTag,
  VALID_GROUP_BY_DIMENSIONS_WITH_TAG,
} from "@/lib/services/types";

interface CostBreakdownControlsProps {
  groupBy: GroupByDimensionWithTag;
  onGroupByChange: (value: GroupByDimensionWithTag) => void;
  selectedTag?: string;
  onTagChange: (value: string) => void;
}

const CostBreakdownControls = ({
  groupBy,
  onGroupByChange,
  selectedTag,
  onTagChange,
}: CostBreakdownControlsProps) => {
  const {
    data: tags,
    isLoading: isLoadingTags,
    error: tagsError,
  } = useEC2TagKeys();

  // Select default tag when groupBy=tag and no tag is selected yet
  useEffect(() => {
    const tagsAreLoaded = tags && tags.length > 0;
    if (tagsAreLoaded && !selectedTag && groupBy === "TAG") {
      const defaultTag = tags[0];
      onTagChange(defaultTag);
    }
  }, [tags, groupBy]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
      <div className="space-y-2 flex items-center gap-x-2">
        <Label htmlFor="group-by" className="text-sm font-medium p-0 m-0">
          Group by
        </Label>
        <Select value={groupBy} onValueChange={onGroupByChange}>
          <SelectTrigger
            id="group-by"
            className="w-[140px] capitalize bg-card border-none"
          >
            <SelectValue placeholder="Select grouping" />
          </SelectTrigger>
          <SelectContent>
            {VALID_GROUP_BY_DIMENSIONS_WITH_TAG.map((groupBy) => (
              <SelectItem key={groupBy} value={groupBy} className="capitalize">
                {groupBy.toLowerCase().split("_").join(" ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {groupBy === "TAG" && (
        <div className="space-y-2 flex items-center gap-x-2">
          <Label htmlFor="tag-select" className="text-sm font-medium p-0 m-0">
            Tag key
          </Label>
          <Select
            value={selectedTag}
            onValueChange={onTagChange}
            disabled={isLoadingTags || !!tagsError}
          >
            <SelectTrigger
              id="tag-select"
              className="max-w-[200px] min-w-[160px] capitalize bg-card border-none"
            >
              <SelectValue
                placeholder={
                  isLoadingTags
                    ? "Loading..."
                    : tagsError
                    ? "Error loading tags"
                    : "Select tag"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {tagsError ? (
                <SelectItem value="error" disabled>
                  Error loading tags
                </SelectItem>
              ) : tags?.length === 0 && !isLoadingTags ? (
                <SelectItem value="no-tags" disabled>
                  No tags found
                </SelectItem>
              ) : (
                tags?.map((tag: string) => (
                  <SelectItem key={tag} value={tag} className="capitalize">
                    {tag.toLowerCase()}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default CostBreakdownControls;
