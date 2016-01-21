import test from 'ava'
import {
  async,
  helpers,
  mock_contentful,
  unmock_contentful,
  compile_fixture
} from '../helpers'

let ctx = {
  query_img_path: 'http://dogesay.com/wow-query.jpg',
  regular_img_path: 'http://dogesay.com/wow.jpg'
}

test.before(async t => {
  mock_contentful({
    entries: [{
      fields: {
        image: {
          fields: { file: { url: ctx.query_img_path } }
        }
      }
    }, {
      fields: {
        image: {
          fields: { file: { url: ctx.regular_img_path } }
        }
      }
    }]
  })
  await ctx::compile_fixture('single-entry--image-view-helper')
  ctx.index_path = `${ctx.public_dir}/index.html`
})

test('renders out image path', async t => {
  t.true(await helpers.file.contains(ctx.index_path, `${ctx.regular_img_path}`, { async }))
})

test('adds query string params to the image', async t => {
  t.true(await helpers.file.contains(ctx.index_path, `${ctx.query_img_path}?w=100&h=100`, { async }))
})

test.after(async t => {
  unmock_contentful()
})