import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import posts from '../data/blog'

const ease = [0.32, 0.72, 0, 1] as const

export default function Blog() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const allTags = [...new Set(posts.flatMap(p => p.tags))]
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return (activeFilter ? posts.filter(p => p.tags.includes(activeFilter)) : posts)
      .filter(p => !q || p.title.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)) || p.body.toLowerCase().includes(q))
  }, [activeFilter, search])

  return (
    <section id="blog" className="section section-alt section-divider">
      <div className="section-header">
        <motion.h2
          initial={{ opacity: 0, letterSpacing: '0.3em' }}
          whileInView={{ opacity: 1, letterSpacing: '-0.02em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="section-title"
        >Blog</motion.h2>
      </div>

      <div className="blog-controls">
        <div className="blog-search-wrap">
          <input
            className="blog-search"
            placeholder="Search posts…"
            aria-label="Search blog posts"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="blog-filter">
          <button
            className={`blog-filter-btn ${activeFilter === null ? 'active' : ''}`}
            onClick={() => setActiveFilter(null)}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`blog-filter-btn ${activeFilter === tag ? 'active' : ''}`}
              onClick={() => setActiveFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="blog-grid">
        {filtered.length === 0 && (
          <p className="blog-empty">No posts match your search. Try a different query.</p>
        )}
        {filtered.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease }}
            className="blog-post"
          >
            <div className="blog-meta">
              <time className="blog-date">{post.date}</time>
              {post.tags.map(tag => (
                <span key={tag} className="blog-tag">{tag}</span>
              ))}
            </div>
            <h3 className="blog-title">
              <a id={post.slug} href={`#${post.slug}`} className="blog-title-link">{post.title}</a>
            </h3>
            <div className="blog-body" dangerouslySetInnerHTML={{ __html: post.body }} />
          </motion.article>
        ))}
      </div>
    </section>
  )
}
