import { Controller, Get, Post, Body, Param, Delete, Patch, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-Board.dto'
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from "./boards.entity"
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
	constructor(private boardsService: BoardsService) {}

    @Get()
    getAllBoard(
        @GetUser() user: User
    ): Promise<Board[]> {
        return this.boardsService.getAllBoards(user);
    }
	// @Get()
	// getAllBoard(): Board[] {
	// 	return this.boardsService.getAllBoards();
    // }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user:User
        ): Promise<Board> {
        return this.boardsService.createBoard(createBoardDto, user);
    }
    // @Post()
    // @UsePipes(ValidationPipe)
    // createBoard(
    //     @Body() createBoardDto: CreateBoardDto
    // ): Board {
    //     return this.boardsService.createBoard(createBoardDto);
    // }
    @Get('/:id')
    getBoardById(@Param('id')id: number): Promise<Board> {
        return this.boardsService.getBoardById(id);
    }
    // @Get('/:id')
    // getBoardById(@Param('id') id: string): Board {
    //     return this.boardsService.getBoardById(id);
    // }

    @Delete(':id')
    deleteBoard(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.boardsService.deleteBoard(id);
    }
    // @Delete('/:id')
    // deleteBoard(@Param('id') id: string): void {
    //     this.boardsService.deleteBoard(id);
    // }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus,
    ): Promise<Board> {
        return this.boardsService.updateBoardStatus(id, status);
    }
    // @Patch('/:id/status')
    // updateBoardSatus(
    //     @Param('id') id: string,
    //     @Body('status', BoardStatusValidationPipe) status: BoardStatus,
    // ) {
    //     return this.boardsService.updateBoardStatus(id, status);
    // }
}