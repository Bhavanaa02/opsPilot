"""Issues API Router"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Issue, IssueStatus, IssueCategory
from app.schemas import IssueCreate, IssueUpdate, IssueResponse

router = APIRouter(
    prefix="/api/issues",
    tags=["issues"],
    responses={404: {"description": "Not found"}},
)

# ═══════════════════════════════════════════════════════════
# CREATE
# ═══════════════════════════════════════════════════════════

@router.post("/", response_model=IssueResponse, status_code=status.HTTP_201_CREATED)
async def create_issue(
    issue: IssueCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new issue
    
    **Request Body:**
    - title: Issue title
    - description: Detailed description
    - category: Issue category
    """
    db_issue = Issue(
        title=issue.title,
        description=issue.description,
        category=issue.category,
        status=IssueStatus.OPEN
    )
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

# ═══════════════════════════════════════════════════════════
# READ
# ═══════════════════════════════════════════════════════════

@router.get("/", response_model=List[IssueResponse])
async def get_issues(
    skip: int = 0,
    limit: int = 10,
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all issues with optional filtering
    
    **Query Parameters:**
    - skip: Number of issues to skip
    - limit: Number of issues to return
    - status: Filter by status (open, investigating, resolved, closed)
    - category: Filter by category
    """
    query = db.query(Issue)
    
    if status:
        query = query.filter(Issue.status == status)
    
    if category:
        query = query.filter(Issue.category == category)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{issue_id}", response_model=IssueResponse)
async def get_issue(
    issue_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific issue by ID
    """
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )
    return db_issue

# ═══════════════════════════════════════════════════════════
# UPDATE
# ═══════════════════════════════════════════════════════════

@router.put("/{issue_id}", response_model=IssueResponse)
async def update_issue(
    issue_id: int,
    issue_update: IssueUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an issue
    """
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )
    
    update_data = issue_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_issue, field, value)
    
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

# ═══════════════════════════════════════════════════════════
# DELETE
# ═══════════════════════════════════════════════════════════

@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_issue(
    issue_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete an issue
    """
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )
    
    db.delete(db_issue)
    db.commit()
