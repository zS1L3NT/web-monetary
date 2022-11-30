<?php

namespace App\Traits;

use Ramsey\Uuid\Uuid as Gen;

trait Uuid {
    protected static function boot() {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Gen::uuid4()->toString();
            }
        });
    }

    public function getIncrementing() {
        return false;
    }

    public function getKeyType() {
        return 'string';
    }
}
