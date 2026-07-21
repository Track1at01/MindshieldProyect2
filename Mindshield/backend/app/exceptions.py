from fastapi import HTTPException, status

class KanbanException(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class NotFoundException(KanbanException):
    def __init__(self, resource: str = "Resource"):
        super().__init__(status.HTTP_404_NOT_FOUND, f"{resource} not found")

class ForbiddenException(KanbanException):
    def __init__(self):
        super().__init__(status.HTTP_403_FORBIDDEN, "Not enough permissions")

class UnauthorizedException(KanbanException):
    def __init__(self):
        super().__init__(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")