import { Router } from 'express';
import { SnippetController } from '../controllers/snippetController';
import { validateCreateSnippet, validateSnippetId } from '../middleware/validation';
import { OpenAiCompletionClient } from '../clients/OpenAiCompletionClient';
import { SnippetService } from '../services/snippetService';

const router = Router();
const aiClient = new OpenAiCompletionClient();
const snippetService = new SnippetService(aiClient);
const snippetController = new SnippetController(snippetService);

/**
 * @swagger
 * /snippets:
 *   post:
 *     summary: Create a new snippet with AI-generated summary
 *     tags: [Snippets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 10000
 *     responses:
 *       201:
 *         description: Snippet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 text:
 *                   type: string
 *                 summary:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       400:
 *         description: Validation error
 */
router.post('/', validateCreateSnippet, snippetController.createSnippet.bind(snippetController));

/**
 * @swagger
 * /snippets/{id}:
 *   get:
 *     summary: Get a snippet by ID
 *     tags: [Snippets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Snippet retrieved successfully
 *       404:
 *         description: Snippet not found
 *       400:
 *         description: Invalid ID format
 */
router.get('/:id', validateSnippetId, snippetController.getSnippetById.bind(snippetController));

/**
 * @swagger
 * /snippets:
 *   get:
 *     summary: Get all snippets
 *     tags: [Snippets]
 *     responses:
 *       200:
 *         description: List of snippets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 snippets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       text:
 *                         type: string
 *                       summary:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                 total:
 *                   type: number
 */
router.get('/', snippetController.getAllSnippets.bind(snippetController));

export default router; 