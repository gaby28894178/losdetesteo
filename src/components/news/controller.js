import globalResponse from '../../utils/responses&Errors/globalResponse.js'
import handleCatchErrorAsync from '../../utils/responses&Errors/handleCatchErrorAsync.js'
import * as newsService from './service.js'

/**
 * Get all
 *
 * @param {*} req
 * @param {*} res
 * @returns A message
 */
export const getAllNews = handleCatchErrorAsync(async (req, res) => {
  console.log('hola')
  const queryParams = req.query
  const items = await newsService.getAllNews(queryParams)
  globalResponse(res, 200, items)
})

/**
 * Get one by id
 *
 * @param {*} req
 * @param {*} res
 * @returns A message
 */
export const getOneById = handleCatchErrorAsync(async (req, res) => {
  const { id } = req.params
  const item = await newsService.getOneById(id)
  globalResponse(res, 200, item)
})

/**
 * create One
 *
 * @param {*} req
 * @param {*} res
 * @returns A message
 */
export const createOne = handleCatchErrorAsync(async (req, res) => {
  const { body, file } = req
  await newsService.createOne({ ...body, file })
  globalResponse(res, 201, { message: 'Item created successfully' })
})

/**
 * create One
 *
 * @param {*} req
 * @param {*} res
 * @returns A message
 */
export const createMany = async (req, res) => {
  const { body } = req
  await newsService.createMany(body)
  globalResponse(res, 201, { message: 'Items created successfully' })
}

/**
 * Update By ID
 *
 * @param {*} req
 * @param {*} res
 * @returns  a message
 */
export const updateById = handleCatchErrorAsync(async (req, res) => {
  const { id } = req.params
  const { body, file } = req
  await newsService.updateById(id, { ...body, file })
  globalResponse(res, 200, { message: 'Items updated successfully' })
})

/**
 * Delete By ID
 *
 * @param {*} req
 * @param {*} res
 * @returns a message
 */
export const deleteById = handleCatchErrorAsync(async (req, res) => {
  const { id } = req.params
  await newsService.deleteById(id)
  globalResponse(res, 200, { message: 'Items deleted successfully' })
})

/**
 * Get all news status
 *
 * @param {*} req
 * @param {*} res
 * @returns A message
 */
export const getAllNewsStatus = handleCatchErrorAsync(async (req, res) => {
  const data = await newsService.getAllNewsStatus()
  globalResponse(res, 200, data)
})
