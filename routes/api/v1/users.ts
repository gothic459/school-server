import { Router } from 'express';
import prisma from '../../../prisma';
import { authRole, authRoleOrPerson } from '../../../middleware/authPage';
import { UserRole } from '../../../enums/userRole';

const router = Router();
router.get('/', authRole(UserRole.ADMIN), async (req, res) => {

  try {
    const result = await prisma.person.findMany({
      include: {
        address: true,
        contact: true,
        personal: true,
        library_access: true,
        faculty: true,
        gradebook: true,
      },
    });

    res.status(200).send(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/profile', authRoleOrPerson([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]), async (req, res) => {
  try {
    const result = await prisma.person.findUnique({
      where: {
        id: Number(req.user?.person_id),
      },
      include: {
        address: true,
        contact: true,
        personal: true,
        library_access: true,
        faculty: true,
        gradebook: true,
        account: {
          select: {
            account_images: {
              select: {
                avatar_url: true,
                background_url: true,
              }
            },
            last_login: true,
          }
        }
      },

    });

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authRoleOrPerson(UserRole.ADMIN), async (req, res) => {
  try {
    const result = await prisma.person.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        address: true,
        contact: true,
        personal: true,
        library_access: true,
        gradebook: true,

      },
    });

    res.status(200).send(result);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }

});
router.post('/', authRole(UserRole.ADMIN), async (req, res) => {
  try {
    const newPerson = await prisma.person.create({
      data: {
        ...req.body,

        address: {
          create: {
            ...req.body.address
          }
        },
        contact: {
          create: {
            ...req.body.contact
          }
        },
        personal: {
          create: {
            ...req.body.personal
          }
        },
        library_access: {
          create: {
            ...req.body.library_access
          }
        }
      },
    });

    const result = await prisma.person.findUnique({
      where: {
        id: newPerson.id,
      },
      include: {
        address: true,
        contact: true,
        personal: true,
        library_access: true,
        gradebook: true,
      },
    });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }

});

router.put('/profile/avatar', authRoleOrPerson([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]), async (req, res) => {
  try {
    const result = await prisma.account.update({
      where: {
        person_id: req.user?.person_id
      },
      data: {
        account_images: {
          upsert: {
            update: {
              avatar_url: req.body.avatar_url
            },
            create: {
              avatar_url: req.body.avatar_url,
              background_url: ''
            }

          },

        }
      },
    });
    res.status(200).send(result);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
router.put('/profile/background', authRoleOrPerson([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]), async (req, res) => {
  try {
    const result = await prisma.account.update({
      where: {
        person_id: req.user?.person_id
      },
      data: {
        account_images: {
          update: {
            background_url: req.body.background_url
          }
        }
      },
    });
    res.status(200).send(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
router.put('/:id', authRoleOrPerson(UserRole.ADMIN), async (req, res) => {
  try {
    const result = await prisma.person.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        ...req.body,

        address: {
          update: {
            ...req.body.address
          }
        },
        contact: {
          update: {
            ...req.body.contact
          }
        },
        personal: {
          update: {
            ...req.body.personal
          }
        },
        library_access: {
          update: {
            ...req.body.library_access
          }
        },
      },

    });
    res.status(200).send(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }

});
router.delete('/:id', authRole(UserRole.ADMIN), async (req, res) => {

  try {
    const result = await prisma.person.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(204).send(result);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
