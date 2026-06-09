"""Knowledge Base API Router"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.database import get_db
from app.models import KnowledgeBase
from app.schemas import KnowledgeBaseCreate, KnowledgeBaseResponse

router = APIRouter(
    prefix="/api/knowledge-base",
    tags=["knowledge_base"],
    responses={404: {"description": "Not found"}},
)

# ═══════════════════════════════════════════════════════════
# CREATE
# ═══════════════════════════════════════════════════════════

@router.post("/", response_model=KnowledgeBaseResponse, status_code=status.HTTP_201_CREATED)
async def create_knowledge_base_entry(
    entry: KnowledgeBaseCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new knowledge base entry
    """
    import json
    
    db_entry = KnowledgeBase(
        title=entry.title,
        category=entry.category,
        problem_description=entry.problem_description,
        root_cause=entry.root_cause,
        resolution_steps=json.dumps(entry.resolution_steps) if entry.resolution_steps else None,
        recommended_commands=json.dumps(entry.recommended_commands) if entry.recommended_commands else None,
        references=json.dumps(entry.references) if entry.references else None
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

# ═══════════════════════════════════════════════════════════
# READ
# ═══════════════════════════════════════════════════════════

@router.get("/", response_model=List[KnowledgeBaseResponse])
async def get_knowledge_base(
    skip: int = 0,
    limit: int = 10,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all knowledge base entries with optional filtering
    
    **Query Parameters:**
    - skip: Number of entries to skip
    - limit: Number of entries to return
    - category: Filter by category
    """
    query = db.query(KnowledgeBase)
    
    if category:
        query = query.filter(KnowledgeBase.category == category)
    
    return query.offset(skip).limit(limit).all()

@router.get("/search", response_model=List[KnowledgeBaseResponse])
async def search_knowledge_base(
    query: str,
    db: Session = Depends(get_db)
):
    """
    Search knowledge base entries by title or problem description
    
    **Query Parameters:**
    - query: Search query string
    """
    if not query:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query cannot be empty"
        )
    
    search_term = f"%{query}%"
    results = db.query(KnowledgeBase).filter(
        or_(
            KnowledgeBase.title.ilike(search_term),
            KnowledgeBase.problem_description.ilike(search_term),
            KnowledgeBase.root_cause.ilike(search_term)
        )
    ).all()
    
    return results

@router.get("/{entry_id}", response_model=KnowledgeBaseResponse)
async def get_knowledge_base_entry(
    entry_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific knowledge base entry by ID
    """
    db_entry = db.query(KnowledgeBase).filter(KnowledgeBase.id == entry_id).first()
    if not db_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge base entry not found"
        )
    return db_entry

# ═══════════════════════════════════════════════════════════
# UPDATE
# ═══════════════════════════════════════════════════════════

@router.put("/{entry_id}", response_model=KnowledgeBaseResponse)
async def update_knowledge_base_entry(
    entry_id: int,
    entry_update: KnowledgeBaseCreate,
    db: Session = Depends(get_db)
):
    """
    Update a knowledge base entry
    """
    import json
    
    db_entry = db.query(KnowledgeBase).filter(KnowledgeBase.id == entry_id).first()
    if not db_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge base entry not found"
        )
    
    db_entry.title = entry_update.title
    db_entry.category = entry_update.category
    db_entry.problem_description = entry_update.problem_description
    db_entry.root_cause = entry_update.root_cause
    db_entry.resolution_steps = json.dumps(entry_update.resolution_steps) if entry_update.resolution_steps else None
    db_entry.recommended_commands = json.dumps(entry_update.recommended_commands) if entry_update.recommended_commands else None
    db_entry.references = json.dumps(entry_update.references) if entry_update.references else None
    
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

# ═══════════════════════════════════════════════════════════
# DELETE
# ═══════════════════════════════════════════════════════════

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_knowledge_base_entry(
    entry_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a knowledge base entry
    """
    db_entry = db.query(KnowledgeBase).filter(KnowledgeBase.id == entry_id).first()
    if not db_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge base entry not found"
        )
    
    db.delete(db_entry)
    db.commit()
