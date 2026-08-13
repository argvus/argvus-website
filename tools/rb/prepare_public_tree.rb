#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "pathname"

public_dir = Pathname.new(ARGV.fetch(0, "public"))
current_pages_dir = Pathname.new(ARGV.fetch(1, "gh-pages-current"))

# Keep the package repository state (packages/ + keys/) from the previous
# gh-pages deployment. Site pages are generated from scratch by Astro.
KEEP = %w[packages keys].freeze

FileUtils.mkdir_p(public_dir)

if current_pages_dir.directory?
  current_pages_dir.children.each do |entry|
    next unless KEEP.include?(entry.basename.to_s)
    next if entry.basename.to_s == ".git"

    FileUtils.cp_r(entry, public_dir)
  end
end

public_dir.glob("**/.nojekyll").each { |path| FileUtils.rm_f(path) }
