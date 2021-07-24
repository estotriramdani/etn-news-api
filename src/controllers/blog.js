const { validationResult } = require('express-validator');
const BlogPost = require('../models/blog');
const slugify = require('slugify');

createBlogPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Input value tidak sesuai');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const title = req.body.title;
  const image = req.body.image;
  const slug =
    slugify(req.body.title).toLowerCase() +
    '-' +
    new Date().getTime().toString();
  const category = req.body.category;
  const author = req.body.author;
  const body = req.body.body;

  const Posting = new BlogPost({
    title,
    slug,
    category,
    body,
    image,
    author: {
      name: author,
    },
  });

  Posting.save()
    .then((result) => {
      res.status(201).json({
        message: 'Create blog post success',
        data: result,
      });
    })
    .catch((err) => console.log(err));
};

getAllBlogPosts = (req, res, next) => {
  const currentPage = parseInt(req.query.currentPage) || 1;
  const perPage = parseInt(req.query.perPage) || 5;
  let totalItems;

  BlogPost.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return BlogPost.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((result) => {
      if (result.length === 0) {
        result = 'Tidak ada data post';
      }
      res.status(201).json({
        message: 'Blog post berhasil diambil',
        total_data: totalItems,
        per_page: perPage,
        currentPage: currentPage,
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

getBlogPostBySlug = (req, res, next) => {
  const slug = req.params.slug;
  BlogPost.findOne({ slug: slug })
    .then((result) => {
      if (!result) {
        const error = new Error(`Blog post dengan id ${slug} tidak ditemukan`);
        error.errorStatus = 404;
        throw error;
      } else {
        res.status(201).json({
          message: 'Data berhasil diambil',
          data: result,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

getBlogPostByCategory = (req, res, next) => {
  const categoryName = req.params.categoryName;
  BlogPost.find({ category: categoryName })
    .then((result) => {
      if (!result) {
        const error = new Error(
          `Blog post dengan id ${categoryName} tidak ditemukan`
        );
        error.errorStatus = 404;
        throw error;
      } else {
        res.status(201).json({
          message: 'Data berhasil diambil',
          data: result,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

getBlogPostMine = (req, res, next) => {
  const username = req.params.username;
  BlogPost.find({ author: { name: username } })
    .then((result) => {
      if (!result) {
        const error = new Error(
          `Blog post dengan id ${username} tidak ditemukan`
        );
        error.errorStatus = 404;
        throw error;
      } else {
        res.status(201).json({
          message: 'Data berhasil diambil',
          data: result,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

updateBlogPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error('Input value tidak sesuai');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }
  console.log(req.params);
  const title = req.body.title;
  const image = req.body.image;
  const slug = req.params.slug;
  const category = req.body.category;
  const body = req.body.body;

  BlogPost.findOne({ slug: slug })
    .then((post) => {
      if (!post) {
        const error = new Error(
          `Blog post dengan slug ${slug} tidak ditemukan.`
        );
        error.errorStatus = 404;
        throw error;
      }
      post.title = title;
      post.slug = slug;
      post.category = category;
      post.body = body;
      post.image = image;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: 'Update berhasil',
        data: result,
      });
    })
    .catch((error) => {
      next(error);
    });
};

deleteBlogPost = (req, res, next) => {
  const slug = req.params.slug;
  BlogPost.findOne({ slug: slug })
    .then((post) => {
      if (!post) {
        const error = new Error(`Blog post dengan ID ${slug} tidak ditemukan.`);
        error.errorStatus = 404;
        throw error;
      }
      return BlogPost.findOneAndRemove({ slug: slug });
    })
    .then((result) => {
      res.status(200).json({
        message: 'Hapus blog post berhasil',
        data: result,
      });
    })
    .catch((err) => next(err));
};

module.exports = {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostByCategory,
  getBlogPostMine,
  updateBlogPost,
  deleteBlogPost,
};
